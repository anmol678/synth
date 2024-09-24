from .schema_generator import SchemaGenerator
from .script_generator import ScriptGenerator
from .script_executor import ScriptExecutor

def get_schema_generator():
    return SchemaGenerator()

def get_script_generator():
    return ScriptGenerator()

def get_script_executor():
    return ScriptExecutor()
