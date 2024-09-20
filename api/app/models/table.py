from pydantic import BaseModel, Field, validator
import sqlparse


class Table(BaseModel):
    name: str = Field(..., description="The name of the table.")
    schema: str = Field(..., description="The SQL schema for the table.")

    @validator('schema')
    def validate_sql_schema(cls, v):
        try:
            parsed = sqlparse.parse(v)
            if not parsed or not parsed[0].tokens:
                raise ValueError("Invalid SQL schema")
        except sqlparse.exceptions.SQLParseError:
            raise ValueError("Invalid SQL schema")
        return v
