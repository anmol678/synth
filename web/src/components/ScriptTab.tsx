import { useAppContext } from '@/context'
import CodeDisplay from '@/components/CodeDisplay'

export default function ScriptTab() {
  const { state, dispatch } = useAppContext()

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <CodeDisplay
        code={state.dataGenerationScript}
        onCodeChange={(code) => dispatch({ type: 'SET_SCRIPT', payload: code })}
        size="full"
      />
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => alert('Test run functionality not implemented yet')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Run
        </button>
        <button
          onClick={() => alert('Save functionality not implemented yet')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save to DB
        </button>
      </div>
    </div>
  )
}
