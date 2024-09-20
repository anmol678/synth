from pydantic import BaseModel, Field, validator
import sqlparse


class Table(BaseModel):
    name: str = Field(..., description="The name of the table.")
    schema_sql: str = Field(..., alias="schema", description="The SQL schema for the table.")

    # this doesn't work because of sqlparse is non-validating parser
    @validator('schema_sql')
    def validate_sql_schema(cls, v):
        try:
            parsed = sqlparse.parse(v)
            if not parsed or not parsed[0].tokens:
                raise ValueError("Invalid SQL schema")
        except sqlparse.exceptions.SQLParseError:
            raise ValueError("Invalid SQL schema")
        return v
