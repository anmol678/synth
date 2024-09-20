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
        return '''You are an expert Python script generator for synthetic data generation based on a given prompt and table schemas.
        You are encouraged to use a step by step approach in the provided scratchpad to plan and reason. Finally, you must provide fully functional Python code based on the instructions provided.
        You must always respond in valid JSON format.
        '''

    @staticmethod
    def create_prompt(instructions: str, selected_tables: list[Table]) -> str:
        table_schemas = [table.schema_sql for table in selected_tables]
        return f'''Generate a Python script that creates fake data for the tables based on the user query and schemas provided.
        The script should use appropriate libraries (e.g., Faker) to generate realistic data. Pay special attention to foreign key relationships and ensure that the data generated for these relationships references previously generated data in the appropriate manner.
        
        Implement the following features in your script:
        1. Use dictionaries to store generated data, with primary keys as dictionary keys.
        2. When creating records with foreign keys, iterate over previously generated data to ensure all foreign key references exist and are valid. Picking randomly is a bad idea.
        3. Ensure that the generated data is consistent across all tables and makes logical sense.

        USER INSTRUCTIONS:
        {instructions}

        SELECTED TABLES AND SCHEMAS:
        {chr(10).join(table_schemas)}
        '''

    def generate(self, instructions: str, selected_tables: list[Table]) -> ScriptGenerationResponse:
        try:
            response = self.client.beta.chat.completions.parse(
                model="gpt-4o-2024-08-06",
                messages=[
                    {"role": "system", "content": self.create_system_prompt()},
                    {"role": "user", "content": self.create_prompt(instructions, selected_tables)}
                ],
                response_format=ScriptGenerationResponse
            )
            return response.choices[0].message.parsed
        except Exception as e:
            logger.error(f"Error generating python script: {str(e)}")
            raise
