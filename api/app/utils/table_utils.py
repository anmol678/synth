import re
from collections import defaultdict

from app.models.table import Table


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
