from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection
from pydantic import BaseModel

from app.db import get_db
from app.services import get_schema_generator, get_script_generator, get_script_executor
from app.services import SchemaGenerator, ScriptGenerator, ScriptExecutor
from app.models.table import Table


router = APIRouter()


class SchemaGenerationRequest(BaseModel):
    prompt: str

class SchemaGenerationResponse(BaseModel):
    tables: list[Table]

@router.post("/generate-schema")
async def generate_schema(
    request: SchemaGenerationRequest,
    schema_generator: SchemaGenerator = Depends(get_schema_generator)
):
    try:
        response = schema_generator.generate(request.prompt)
        return SchemaGenerationResponse(tables=response.tables)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SchemaUpdateRequest(BaseModel):
    prompt: str
    tables: list[Table]

class SchemaUpdateResponse(BaseModel):
    tables: list[Table]

@router.post("/update-schema")
async def update_schema(
    request: SchemaUpdateRequest,
    schema_generator: SchemaGenerator = Depends(get_schema_generator)
):
    try:
        response = schema_generator.update(request.prompt, request.tables)
        return SchemaUpdateResponse(tables=response.tables)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ScriptGenerationRequest(BaseModel):
    prompt: str
    selected_tables: list[Table]

class ScriptGenerationResponse(BaseModel):
    script: str

@router.post("/generate-script")
async def generate_data_script(
    request: ScriptGenerationRequest,
    script_generator: ScriptGenerator = Depends(get_script_generator)
):
    try:
        response = script_generator.generate(request.prompt, request.selected_tables)
        return ScriptGenerationResponse(script=response.script)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ScriptUpdateRequest(BaseModel):
    prompt: str
    script: str
    selected_tables: list[Table]

class ScriptUpdateResponse(BaseModel):
    script: str

@router.post("/update-script")
async def update_script(
    request: ScriptUpdateRequest,
    script_generator: ScriptGenerator = Depends(get_script_generator)
):
    try:
        response = script_generator.update(request.prompt, request.script, request.selected_tables)
        return ScriptUpdateResponse(script=response.script)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ScriptExecutionRequest(BaseModel):
    tables: list[Table]
    script: str

class ScriptExecutionResponse(BaseModel):
    message: str
    result: str

@router.post("/execute-script")
async def execute_fake_data_generation(
    request: ScriptExecutionRequest,
    db: Connection = Depends(get_db),
    script_executor: ScriptExecutor = Depends(get_script_executor)
):
    try:
        result = await script_executor.execute(request.tables, request.script)
        return ScriptExecutionResponse(message="Data generation completed successfully", result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
