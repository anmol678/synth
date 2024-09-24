from asyncpg import Connection

from app.models.table import Table
from app.utils.table_utils import topological_sort
from app.utils.db_operations import drop_all_tables, create_table, insert_data
from app.utils.logger import logger


class ScriptExecutor:

    async def test_run(self, tables: list[Table], script: str) -> dict:
        try:
            sorted_tables = topological_sort(tables)
            local_namespace = await self._execute_script(script)
            results = {}
            for table in sorted_tables:
                data = local_namespace.get(f"{table.name.lower()}_data", [])
                results[table.name] = data
            return results
        except Exception as e:
            logger.error(f"Error in test run: {str(e)}")
            raise

    async def execute(self, db: Connection, tables: list[Table], script: str) -> dict:
        async with db.transaction():
            try:
                await self._prepare_database(db)
                sorted_tables = await self._create_tables(db, tables)
                local_namespace = await self._execute_script(script)
                results = await self._insert_data(db, sorted_tables, local_namespace)
                return results
            except Exception as e:
                logger.error(f"Error executing script: {str(e)}")
                raise

    async def _prepare_database(self, db: Connection):
        await drop_all_tables(db)

    async def _create_tables(self, db: Connection, tables: list[Table]) -> list[Table]:
        sorted_tables = topological_sort(tables)
        for table in sorted_tables:
            await create_table(db, table.name, table.schema_sql)
        return sorted_tables

    async def _execute_script(self, script: str) -> dict:
        local_namespace = {}
        exec(script, globals(), local_namespace)
        return local_namespace

    async def _insert_data(self, db: Connection, sorted_tables: list[Table], local_namespace: dict) -> dict:
        results = {}
        for table in sorted_tables:
            data = local_namespace.get(f"{table.name.lower()}_data", [])
            logger.info(f"Inserting {len(data)} rows into {table.name}")
            results[table.name] = await insert_data(db, table.name, data)
        return results
