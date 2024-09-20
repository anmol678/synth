import { useState } from 'react'
import { Table } from '@/types'
import CodeDisplay from '@/components/CodeDisplay'

interface TabViewProps {
  tables: Table[]
  selectedTables: Table[]
  onSelectionChange: (selected: Table[]) => void
}

export default function TabView({ tables, selectedTables, onSelectionChange }: TabViewProps) {
  const [activeTab, setActiveTab] = useState<string | null>(tables[0].name)

  const handleCheckboxChange = (table: Table) => {
    const isSelected = selectedTables.some((t) => t.name === table.name)
    const newSelection = isSelected
      ? selectedTables.filter((t) => t.name !== table.name)
      : [...selectedTables, table]
    onSelectionChange(newSelection)
  }

  return (
    <div className="mb-8">
      <div className="flex border-b">
        {tables.map((table) => (
          <div key={table.name} className="flex items-center border-r last:border-r-0">
            <div
              className={`flex items-center px-4 py-2 gap-2 ${activeTab === table.name
                ? 'bg-blue-300'
                : 'bg-blue-100'
                }`}
            >
              <input
                type="checkbox"
                checked={selectedTables.some((t) => t.name === table.name)}
                onChange={() => handleCheckboxChange(table)}
                className="w-5 h-5 cursor-pointer accent-green-300"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className={`mr-2 ${activeTab === table.name
                  ? 'text-gray-700 font-semibold'
                  : 'text-gray-700'
                  }`}
                onClick={() => setActiveTab(table.name)}
              >
                {table.name}
              </button>
            </div>
          </div>
        ))}
      </div>
      {activeTab && (
        <CodeDisplay
          code={tables.find((t) => t.name === activeTab)?.schema || ''}
          onCodeChange={(newCode) => {
            const updatedTables = tables.map((t) =>
              t.name === activeTab ? { ...t, schema: newCode } : t
            )
            onSelectionChange(updatedTables)
          }}
        />
      )}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Selected Tables:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedTables.map((table) => (
            <span
              key={table.name}
              className="px-2 py-1 bg-green-100 text-green-800 rounded"
            >
              {table.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}