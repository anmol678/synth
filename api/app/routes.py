from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection
from pydantic import BaseModel

from app.db import get_db
from app.services.schema_generator import SchemaGenerator
from app.services.script_generator import ScriptGenerator
from app.models.table import Table


router = APIRouter()


class SchemaGenerationRequest(BaseModel):
    prompt: str

@router.post("/generate-schema")
async def generate_schema(request: SchemaGenerationRequest, db: Connection = Depends(get_db)):
    try:
        response = SchemaGenerator().generate(request.prompt)
        return {"tables": response.tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ScriptGenerationRequest(BaseModel):
    prompt: str
    selected_tables: list[Table]

@router.post("/generate-script")
async def generate_data_script(request: ScriptGenerationRequest, db: Connection = Depends(get_db)):
    try:
        response = ScriptGenerator().generate(request.prompt, request.selected_tables)
        return {"script": response.script}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


