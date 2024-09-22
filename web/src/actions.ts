import { Table } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || '';

export async function generateSchema(prompt: string) {
  try {
    const response = await fetch(`${BASE_URL}/generate-schema`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Schema generation failed: ${errorData.detail || 'Unknown error'}`);
    }
    return response.json();
  } catch (error: unknown) {
    console.error('Error in generateSchema:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to generate schema');
  }
}

export async function generateScript(prompt: string, selectedTables: Table[]) {
  try {
    const response = await fetch(`${BASE_URL}/generate-script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, selected_tables: selectedTables }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Script generation failed: ${errorData.detail || 'Unknown error'}`);
    }
    return response.json();
  } catch (error: unknown) {
    console.error('Error in generateScript:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to generate script');
  }
}

export async function executeScript(script: string, tables: Table[]) {
  try {
    const response = await fetch(`${BASE_URL}/execute-script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script, tables }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Script execution failed: ${errorData.detail || 'Unknown error'}`);
    }
    return response.json();
  } catch (error: unknown) {
    console.error('Error in executeScript:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to execute script');
  }
}
