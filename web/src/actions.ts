import { Table } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || '';

export async function generateSchema(prompt: string) {
  const response = await fetch(`${BASE_URL}/generate-schema`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error('Failed to generate schema');
  return response.json();
}

export async function generateScript(prompt: string, selectedTables: Table[]) {
  const response = await fetch(`${BASE_URL}/generate-script`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, selected_tables: selectedTables }),
  });
  if (!response.ok) throw new Error('Failed to generate script');
  return response.json();
}

export async function executeScript(script: string) {
  const response = await fetch(`${BASE_URL}/execute-script`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ script }),
  });
  if (!response.ok) throw new Error('Failed to execute script');
  return response.json();
}