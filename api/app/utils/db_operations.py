from asyncpg import Connection

from app.utils.logger import logger


async def fetch_all_table_names(conn: Connection):
    query = """
    SELECT table_name 
    FROM information_schema.tables
    WHERE table_schema = 'public'
    """
    tables = await conn.fetch(query)
    return [table['table_name'] for table in tables]

async def drop_all_tables(conn: Connection):
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

async def fetch_table_schema(conn: Connection, table_name: str, schema_name: str = 'public'):
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

async def create_table(db: Connection, table_name: str, schema: str):
    try:
        logger.info(f"Creating table: {table_name}")
        await db.execute(schema)
        logger.info(f"Table {table_name} created successfully")
    except Exception as e:
        logger.error(f"Error creating table {table_name}: {str(e)}")
        raise

async def insert_data(db: Connection, table_name: str, data):
    if data:
        try:
            columns = ', '.join(data[0].keys())
            placeholders = ', '.join(f'${i+1}' for i in range(len(data[0])))
            query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
            await db.executemany(query, [tuple(row.values()) for row in data])
            logger.info(f"Successfully inserted {len(data)} rows into {table_name}")
            return len(data)
        except Exception as e:
            logger.error(f"Error inserting data into {table_name}: {str(e)}")
            raise
    else:
        logger.info(f"No data to insert for {table_name}")
        return 0
