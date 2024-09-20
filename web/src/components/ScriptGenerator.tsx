import { useState, FormEvent } from 'react'
import { Table } from '@/types'
import { generateScript } from '@/actions'

interface ScriptGeneratorProps {
  selectedTables: Table[]
  onScriptGenerated: (script: string) => void
  disabled: boolean
}

export default function ScriptGenerator({ selectedTables, onScriptGenerated, disabled }: ScriptGeneratorProps) {
  const [dataPrompt, setDataPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setIsGenerating(true)
      const result = await generateScript(dataPrompt, selectedTables)
      onScriptGenerated(result.script)
    } catch (error) {
      console.error(error)
      alert('Failed to generate script. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const isDisabled = disabled || isGenerating

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Data Script Generator</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={dataPrompt}
          onChange={(e) => setDataPrompt(e.target.value)}
          className="w-full h-32 p-2 border rounded mb-2"
          placeholder="Enter data generation prompt..."
        />
        <button
          type="submit"
          className={`px-4 py-2 bg-green-500 text-white rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled}
        >
          {isGenerating ? 'Generating...' : 'Generate Data Script'}
        </button>
      </form>
    </div>
  )
}