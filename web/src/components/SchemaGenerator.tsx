import { useState, FormEvent } from 'react'
import CodeDisplay from '@/components/CodeDisplay'
import { Table } from '@/types'
import { generateSchema } from '@/actions'

interface SchemaGeneratorProps {
  tables: Table[],
  onSchemaGenerated: (tables: Table[]) => void
}

export default function SchemaGenerator({ tables, onSchemaGenerated }: SchemaGeneratorProps) {
  const [schemaPrompt, setSchemaPrompt] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const result = await generateSchema(schemaPrompt)
      onSchemaGenerated(result.tables)
    } catch (error) {
      console.error(error)
      alert('Failed to generate schema. Please try again.')
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Schema Generator</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={schemaPrompt}
          onChange={(e) => setSchemaPrompt(e.target.value)}
          className="w-full h-32 p-2 border rounded mb-2"
          placeholder="Enter schema generation prompt..."
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Generate Schema
        </button>
      </form>
      {tables.map((table, index) => (
        <CodeDisplay
          key={index}
          title={`Generated Schema for ${table.name}`}
          code={table.schema}
          onCodeChange={(newCode) => {
            const updatedTables = [...tables]
            updatedTables[index] = { ...table, schema: newCode }
            onSchemaGenerated(updatedTables)
          }}
        />
      ))}
    </div>
  )
}
