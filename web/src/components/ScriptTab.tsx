import CodeDisplay from '@/components/CodeDisplay'
import Button from '@/components/Button'
import { useScriptTab } from '@/hooks/useScriptTab'

export default function ScriptTab() {
  const {
    dataGenerationScript,
    isExecuting,
    executionResult,
    onTestRun,
    onExecuteScript,
    onCodeChange
  } = useScriptTab()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-2 h-full">
        <CodeDisplay
          code={dataGenerationScript}
          onCodeChange={onCodeChange}
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
          <Button
            onClick={onTestRun}
            data-style='secondary'
            disabled={isExecuting}
          >
            Test Run
          </Button>
          <Button
            onClick={onExecuteScript}
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
