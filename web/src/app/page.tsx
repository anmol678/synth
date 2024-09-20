"use client"

import { useState } from 'react'
import SchemaGenerator from '@/components/SchemaGenerator'
import ScriptGenerator from '@/components/ScriptGenerator'
import TableSelector from '@/components/TableSelector'
import CodeDisplay from '@/components/CodeDisplay'
import { Table } from '@/types'
import { executeScript } from '@/actions'

export default function Home() {
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTables, setSelectedTables] = useState<Table[]>([])
  const [dataGenerationScript, setDataGenerationScript] = useState('')
  const [error, setError] = useState('')

  const handleSchemaGeneration = (generatedTables: Table[]) => {
    setTables(generatedTables)
    setSelectedTables([])
  }

  const handleScriptGeneration = (script: string) => {
    setDataGenerationScript(script)
  }

  const handleTableSelection = (selected: Table[]) => {
    setSelectedTables(selected)
  }

  const handleTestRun = async () => {
    // Implement test run functionality
    alert('Test run functionality not implemented yet')
  }

  const handleExecuteScript = async () => {
    try {
      await executeScript(dataGenerationScript)
      alert('Data generation completed successfully')
    } catch (error) {
      setError('Failed to execute data generation. Please try again.')
      console.error(error)
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Schema and Data Generator</h1>

      <SchemaGenerator tables={tables} onSchemaGenerated={handleSchemaGeneration} />

      {tables.length > 0 && (
        <>
          <TableSelector tables={tables} selectedTables={selectedTables} onSelectionChange={handleTableSelection} />
          <ScriptGenerator selectedTables={selectedTables} onScriptGenerated={handleScriptGeneration} />
        </>
      )}

      {dataGenerationScript && (
        <CodeDisplay
          title="Generated Data Script"
          code={dataGenerationScript}
          onCodeChange={setDataGenerationScript}
          actions={[
            { label: 'Test Run', onClick: handleTestRun },
            { label: 'Execute Script', onClick: handleExecuteScript },
          ]}
        />
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </main>
  )
}