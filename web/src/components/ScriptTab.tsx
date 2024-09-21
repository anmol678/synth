import { useState } from 'react'
import { useAppContext } from '@/context'
import CodeDisplay from '@/components/CodeDisplay'
import { executeScript } from '@/actions'

export default function ScriptTab() {
  const { state, dispatch } = useAppContext()
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<string | null>(null)

  const handleExecuteScript = async () => {
    setIsExecuting(true)
    setExecutionResult(null)
    try {
      const selectedTables = state.tables.filter((table) => table.isSelected)
      const response = await executeScript(state.dataGenerationScript, selectedTables)
      setExecutionResult(JSON.stringify(response))
    } catch (error: unknown) {
      setExecutionResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    setIsExecuting(false)
    setIsExecuting(false)
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <CodeDisplay
        code={state.dataGenerationScript}
        onCodeChange={(code) => dispatch({ type: 'SET_SCRIPT', payload: code })}
        size="full"
      />
      <div className="flex space-x-2 mt-4">
        {/* TODO: add test run functionality */}
        <button
          onClick={() => alert('Test run functionality not implemented yet')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={true}
        >
          Test Run
        </button>
        <button
          onClick={handleExecuteScript}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={isExecuting}
        >
          Execute & Save
        </button>
      </div>
      {executionResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Execution Result</h3>
          <pre className="text-sm whitespace-pre-wrap break-words">{executionResult}</pre>
        </div>
      )}
    </div>
  )
}
