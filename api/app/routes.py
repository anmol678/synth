from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection
from pydantic import BaseModel

from app.db import get_db
from app.services.schema_generator import SchemaGenerator
from app.services.script_generator import ScriptGenerator
from app.services.script_executor import ScriptExecutor
from app.models.table import Table


router = APIRouter()


class SchemaGenerationRequest(BaseModel):
    prompt: str

@router.post("/generate-schema")
async def generate_schema(request: SchemaGenerationRequest):
    try:
        response = SchemaGenerator().generate(request.prompt)
        return {"tables": response.tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SchemaUpdateRequest(BaseModel):
    prompt: str
    tables: list[Table]

@router.post("/update-schema")
async def update_schema(request: SchemaUpdateRequest):
    try:
        response = SchemaGenerator().update(request.prompt, request.tables)
        return {"tables": response.tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ScriptGenerationRequest(BaseModel):
    prompt: str
    selected_tables: list[Table]

@router.post("/generate-script")
async def generate_data_script(request: ScriptGenerationRequest):
    try:
        response = ScriptGenerator().generate(request.prompt, request.selected_tables)
        return {"script": response.script}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ScriptUpdateRequest(BaseModel):
    prompt: str
    script: str
    selected_tables: list[Table]

@router.post("/update-script")
async def update_script(request: ScriptUpdateRequest):
    try:
        response = ScriptGenerator().update(request.prompt, request.script, request.selected_tables)
        return {"script": response.script}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ScriptExecutionRequest(BaseModel):
    tables: list[Table]
    script: str

@router.post("/execute-script")
async def execute_fake_data_generation(request: ScriptExecutionRequest, db: Connection = Depends(get_db)):
    try:
        executor = ScriptExecutor(db)
        result = await executor.execute(request.tables, request.script)
        return {"message": "Data generation completed successfully", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
