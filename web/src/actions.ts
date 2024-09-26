import { Table } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || '';

export async function post<T>(endpoint: string, body: object): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Unknown error')
    }

    return response.json()
  } catch (error: unknown) {
    console.error(`Error in POST ${endpoint}:`, error)
    throw new Error(error instanceof Error ? error.message : 'Unknown error')
  }
}

export async function generateSchema(prompt: string) {
  return post<{ tables: Table[] }>('/generate-schema', { prompt })
}

export async function updateSchema(prompt: string, tables: Table[]) {
  return post<{ tables: Table[] }>('/update-schema', { prompt, tables })
}

export async function generateScript(prompt: string, selectedTables: Table[]) {
  return post<{ script: string }>('/generate-script', { prompt, selected_tables: selectedTables })
}

export async function updateScript(prompt: string, script: string, selectedTables: Table[]) {
  return post<{ script: string }>('/update-script', { prompt, script, selected_tables: selectedTables })
}

export async function testRunScript(script: string, tables: Table[]) {
  return post<{ result: object[] }>('/test-run-script', { script, tables })
}

export async function executeScript(script: string, tables: Table[]) {
  return post<{ status: string }>('/execute-script', { script, tables })
}
