import { useState } from 'react'
import CodeDisplay from '@/components/CodeDisplay'
import { executeScript } from '@/actions'
import { Table } from '@/types'

interface DataGeneratorProps {
  dataGenerationScript: string
  setDataGenerationScript: (script: string) => void
  selectedTables: Table[]
}

export default function DataGenerator({ dataGenerationScript, setDataGenerationScript, selectedTables }: DataGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const handleTestRun = async () => {
    // Implement test run functionality
    alert('Test run functionality not implemented yet')
  }

  const handleExecuteScript = async () => {
    setIsLoading(true)
    setError('')
    setResult('')
    try {
      const response = await executeScript(dataGenerationScript, selectedTables)
      setResult(JSON.stringify(response.result))
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to execute data generation. Please try again.')
      } else {
        setError('An unknown error occurred. Please try again.')
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-8">
      <CodeDisplay
        code={dataGenerationScript}
        onCodeChange={setDataGenerationScript}
        size="large"
      />
      <div className="flex space-x-2">
        {/* <button
          onClick={handleTestRun}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Test Run
        </button> */}
        <button
          onClick={handleExecuteScript}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Executing...' : 'Execute Script'}
        </button>
      </div>
      {result && <p className="text-green-500">{result}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}