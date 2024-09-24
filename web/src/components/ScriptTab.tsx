import { useState } from 'react'
import { ActionType } from '@/types'
import CodeDisplay from '@/components/CodeDisplay'
import Button from '@/components/Button'
import { executeScript } from '@/actions'
import { useAppContext } from '@/context'

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
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-2 h-full">
        <CodeDisplay
          code={state.dataGenerationScript}
          onCodeChange={(code) => dispatch({ type: ActionType.SET_SCRIPT, payload: code })}
          variant="full"
        />
      </div>
      <div className="flex-shrink-0 flex justify-between items-center w-full border-t-2 p-4 bg-white min-h-20">
        <div className="p-2 flex items-baseline gap-2 whitespace-pre-wrap break-words">
          {executionResult && (
            <span className="font-mono text-sm">{executionResult}</span>
          )}
        </div>
        <div className="flex items-center self-end space-x-2 h-full flex-shrink-0">
          {/* TODO: add test run functionality */}
          <Button
            onClick={() => alert('Test run functionality not implemented yet')}
            data-style='secondary'
            disabled={true}
          >
            Test Run
          </Button>
          <Button
            onClick={handleExecuteScript}
            data-style='action'
            disabled={isExecuting}
          >
            Execute & Save
          </Button>
        </div>
      </div>
    </div>
  )
}
