import { useAppContext } from '@/context'
import CodeDisplay from '@/components/CodeDisplay'
import Loader from '@/components/Loader'

export default function ScriptTab() {
  const { state, dispatch } = useAppContext()

  return (
    <div className="p-4">
      {state.loading && <Loader />}
      <CodeDisplay
        code={state.dataGenerationScript}
        onCodeChange={(code) => dispatch({ type: 'SET_SCRIPT', payload: code })}
        size="large"
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
