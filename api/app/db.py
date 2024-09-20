import asyncpg
import os

async def init_db():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    await conn.close()

async def get_db():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    try:
        yield conn
    finally:
        await conn.close()
