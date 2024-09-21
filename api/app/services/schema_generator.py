from openai import OpenAI
import os
from pydantic import BaseModel, Field
from typing import List

from app.models.table import Table
from app.utils.logger import logger


class SchemaResponse(BaseModel):        
    scratchpad: str = Field(..., description="The scratchpad is a space for the LLM to plan and reason before providing a final response.")
    tables: List[Table] = Field(..., description="A list of table names with valid PostgreSQL schemas.")


class SchemaGenerator:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    @staticmethod
    def create_system_prompt() -> str:
        return '''You are an expert synthetic data generator and simulator for complex data hierarchies at large organizations.
        You are encouraged to use a step by step approach in the provided scratchpad to plan and reason. Finally, you must provide a list of table names and their respective SQL schemas.
        You must always respond in valid JSON format.
        '''

    @staticmethod
    def create_prompt(query: str) -> str:
        return f'''Your task is to break down the user query to generate perfectly defined SQL schemas for one or more tables, including any dependencies or foreign key relationships between them.
        For example: Simulating Rippling would require a payroll table, paycheck table, employees table, organizations table, etc. Each table would have a unique schema with some relationships between them. For instance, the paycheck table would map back to actual records on the employees table, and make logical sense based on the employee's info (assume the employee is paid 120k per year on a biweekly (once every two weeks) recurring schedule. The paycheck with that employee_id should be $5000.
        
        USER QUERY:
        {query}
        '''

    def generate(self, query: str) -> SchemaResponse:
        try:
            response = self.client.beta.chat.completions.parse(
                model="gpt-4o-2024-08-06",
                messages=[
                    {"role": "system", "content": self.create_system_prompt()},
                    {"role": "user", "content": self.create_prompt(query)}
                ],
                response_format=SchemaResponse
            )
            return response.choices[0].message.parsed
        except Exception as e:
            logger.error(f"Error generating schema: {str(e)}")
            raise
