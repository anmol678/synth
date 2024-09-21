from asyncpg import Connection

from app.models.table import Table
from app.utils.db_tables import drop_all_tables, topological_sort
from app.utils.logger import logger


class ScriptExecutor:
    def __init__(self, db: Connection):
        self.db = db

    async def execute(self, tables: list[Table], script: str) -> dict:
        try:
            await drop_all_tables(self.db)
            
            # Create tables in topological order
            sorted_tables = topological_sort(tables)
            logger.info(f"Sorted tables: {sorted_tables}")
            for table in sorted_tables:
                await self.db.execute(table.schema_sql)
            
            # Execute the script
            local_namespace = {}
            exec(script, globals(), local_namespace)

            logger.info(f"namespace: {local_namespace}")
            
            # Insert generated data into tables
            results = {}
            for table in sorted_tables:
                data = local_namespace.get(f"{table.name}_data", [])
                logger.info(f"Inserting {len(data)} rows into {table.name}")
                if data:
                    columns = ', '.join(data[0].keys())
                    placeholders = ', '.join(f'${i+1}' for i in range(len(data[0])))
                    query = f"INSERT INTO {table.name} ({columns}) VALUES ({placeholders})"
                    await self.db.executemany(query, [tuple(row.values()) for row in data])
                    results[table.name] = len(data)
                else:
                    results[table.name] = 0
            
            return results
        except Exception as e:
            logger.error(f"Error executing script: {str(e)}")
            raise
