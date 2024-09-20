import { useState, FormEvent } from 'react'
import { Table } from '@/types'
import { generateSchema } from '@/actions'

interface SchemaGeneratorProps {
  onSchemaGenerated: (tables: Table[]) => void,
}

export default function SchemaGenerator({ onSchemaGenerated }: SchemaGeneratorProps) {
  const [schemaPrompt, setSchemaPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setIsGenerating(true)
      const result = await generateSchema(schemaPrompt)
      onSchemaGenerated(result.tables)
    } catch (error) {
      console.error(error)
      alert('Failed to generate schema. Please try again.')
    } finally {
      setIsGenerating(false)
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
          disabled={isGenerating}
        />
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 text-white rounded ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Schema'}
        </button>
      </form>
    </div>
  )
}
