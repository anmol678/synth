from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection
from pydantic import BaseModel

from app.db import get_db
from app.services.schema import SchemaGenerator


router = APIRouter()


class SchemaRequest(BaseModel):
    prompt: str

@router.post("/schema")
async def create_schema(request: SchemaRequest, db: Connection = Depends(get_db)):
    try:
        response = SchemaGenerator().generate(request.prompt)
        return {"tables": response.tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

