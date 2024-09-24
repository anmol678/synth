import { useAppContext } from '@/context'
import Button from '@/components/Button'

export default function TestResultsTab() {
  const { state } = useAppContext()

  const testResults = state.testResults

  if (!testResults) {
    return <div>Run a test to see the generated data.</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-4 p-4">
        {Object.entries(testResults).map(([tableName, data]) => (
          <div key={tableName} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">{tableName}</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Object.keys(data[0] || {}).map((key) => (
                    <th key={key} className="border p-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="border p-2">{JSON.stringify(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 flex items-center justify-end w-full border-t-2 p-4 bg-white">
        <Button
          onClick={() => { }}
          data-style='action'
        >
          Save Data
        </Button>
      </div>
    </div>
  )
}