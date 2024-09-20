from openai import OpenAI
import os
from pydantic import BaseModel, Field

from app.models.table import Table
from app.utils.logger import logger


class ScriptGenerationResponse(BaseModel):
    scratchpad: str = Field(..., description="The scratchpad is a space for the LLM to plan and reason before providing a final response.")
    script: str = Field(..., description="A Python script to generate fake data based on the provided prompt and tables.")


class ScriptGenerator:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    @staticmethod
    def create_system_prompt() -> str:
        return '''You are an expert synthetic data generator for complex data hierarchies at large organizations.
        You are encouraged to use a step by step approach in the provided scratchpad to plan and reason. Finally, you must provide a fully functional Python script based on the instructions provided.
        You must always respond in valid JSON format.
        '''

    @staticmethod
    def create_prompt(query: str, selected_tables: list[Table]) -> str:
        table_schemas = [table.schema_sql for table in selected_tables]
        return f'''Your task is to generate a Python script that creates fake data for the selected tables based on the user query and table schemas provided.
        The script should use appropriate libraries (e.g., Faker) to generate realistic data and should respect the relationships between tables.

        USER QUERY:
        {query}

        SELECTED TABLES AND SCHEMAS:
        {chr(10).join(table_schemas)}

        Please provide a Python script that generates fake data for these tables, respecting their relationships and the user's requirements.
        '''

    def generate(self, query: str, selected_tables: list[Table]) -> ScriptGenerationResponse:
        try:
            response = self.client.beta.chat.completions.parse(
                model="gpt-4o-2024-08-06",
                messages=[
                    {"role": "system", "content": self.create_system_prompt()},
                    {"role": "user", "content": self.create_prompt(query, selected_tables)}
                ],
                response_format=ScriptGenerationResponse
            )
            return response.choices[0].message.parsed
        except Exception as e:
            logger.error(f"Error generating python script: {str(e)}")
            raise
