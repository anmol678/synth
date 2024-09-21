import re
from collections import defaultdict

from app.models.table import Table
from app.utils.logger import logger


async def fetch_all_table_names(conn):
    query = """
    SELECT table_name 
    FROM information_schema.tables
    WHERE table_schema = 'public'
    """
    tables = await conn.fetch(query)
    return [table['table_name'] for table in tables]

async def drop_all_tables(conn):
    """
    Drop all tables in the database, handling foreign key dependencies.
    """
    # Disable foreign key checks
    await conn.execute("SET CONSTRAINTS ALL DEFERRED")

    # Get all table names
    tables = await fetch_all_table_names(conn)

    # Drop all tables
    for table in tables:
        try:
            await conn.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE')
        except Exception as e:
            logger.error(f"Error dropping table {table}: {str(e)}")

    # Re-enable foreign key checks
    await conn.execute("SET CONSTRAINTS ALL IMMEDIATE")

    logger.info("All tables have been dropped.")

async def fetch_table_schema(conn, table_name, schema_name='public'):
    try:
        query = """
        SELECT column_name, data_type, character_maximum_length, 
               is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position
        """
        
        columns = await conn.fetch(query, schema_name, table_name)
        
        pk_query = """
        SELECT a.attname
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = ($1 || '.' || $2)::regclass AND i.indisprimary
        """
        
        primary_keys = await conn.fetch(pk_query, schema_name, table_name)
        
        schema = []
        for col in columns:
            col_def = f"{col['column_name']} {col['data_type']}"
            if col['character_maximum_length']:
                col_def += f"({col['character_maximum_length']})"
            if col['is_nullable'] == 'NO':
                col_def += " NOT NULL"
            if col['column_default']:
                col_def += f" DEFAULT {col['column_default']}"
            schema.append(col_def)
        
        pk_constraint = ""
        if primary_keys:
            pk_cols = ", ".join([pk['attname'] for pk in primary_keys])
            pk_constraint = f",\nPRIMARY KEY ({pk_cols})"
        
        # Add query to fetch foreign keys
        fk_query = """
        SELECT
            tc.constraint_name,
            kcu.column_name,
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema=$1 AND tc.table_name=$2;
        """
        
        foreign_keys = await conn.fetch(fk_query, schema_name, table_name)

        # Add foreign key constraints to the schema
        for fk in foreign_keys:
            fk_constraint = f"FOREIGN KEY ({fk['column_name']}) REFERENCES {fk['foreign_table_schema']}.{fk['foreign_table_name']}({fk['foreign_column_name']})"
            schema.append(fk_constraint)
        
        table_schema = f"CREATE TABLE {schema_name}.{table_name} (\n"
        table_schema += ",\n".join(schema)
        table_schema += pk_constraint
        table_schema += "\n);"
        
        return table_schema
    except Exception as e:
        logger.error(f"Error fetching table schema: {e}")
        return None

def extract_foreign_keys(schema_sql: str) -> list[str]:
    # Regular expression to match explicit FOREIGN KEY constraints
    explicit_fk_pattern = r'FOREIGN KEY\s*\([^)]+\)\s*REFERENCES\s*(\w+)'
    
    # Regular expression to match implicit foreign key references
    implicit_fk_pattern = r'\b(\w+)\s+\w+(?:\(\d+(?:,\s*\d+)?\))?\s+REFERENCES\s+(\w+)'
    
    # Find all matches in the schema SQL
    explicit_matches = re.findall(explicit_fk_pattern, schema_sql, re.IGNORECASE)
    implicit_matches = re.findall(implicit_fk_pattern, schema_sql, re.IGNORECASE)
    
    # Combine explicit and implicit matches
    all_matches = explicit_matches + [match[1] for match in implicit_matches]
    
    # Return the list of unique referenced table names
    return list(set(all_matches))

def topological_sort(tables: list[Table]) -> list[Table]:
    """
    Perform topological sort on the list of tables based on their foreign key relationships.
    """
    # Extract foreign keys from the schema SQL of each table
    tables_with_fks = [(table, extract_foreign_keys(table.schema_sql)) for table in tables]
    
    # Create a graph representation
    graph = defaultdict(list)
    in_degree = {table.name: 0 for table, _ in tables_with_fks}
    name_to_table = {table.name: table for table, _ in tables_with_fks}

    # Build the graph and in-degree
    for table, fks in tables_with_fks:
        for fk in fks:
            graph[fk].append(table.name)
            in_degree[table.name] += 1

    # Perform topological sort
    queue = [table.name for table, _ in tables_with_fks if in_degree[table.name] == 0]
    sorted_names = []

    while queue:
        current = queue.pop(0)
        sorted_names.append(current)

        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # Check for circular dependencies
    if len(sorted_names) != len(tables_with_fks):
        raise ValueError("Circular dependency detected in table relationships")

    # Return the sorted list of Table objects
    return [name_to_table[name] for name in sorted_names]
