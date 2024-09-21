import { useState } from 'react'
import { useAppContext } from '@/context'
import { TableSelectable } from '@/types'
import CodeDisplay from '@/components/CodeDisplay'

export default function TableSchemaTab() {
  const { state, dispatch } = useAppContext()

  const updateTables = (updateFn: (table: TableSelectable) => TableSelectable) => {
    const updatedTables = state.tables.map(updateFn)
    dispatch({ type: 'SET_TABLES', payload: updatedTables })
  }

  const handleCheckboxChange = (table: TableSelectable) => {
    updateTables((t) =>
      t.name === table.name ? { ...t, isSelected: !t.isSelected } : t
    )
  }

  const handleSchemaChange = (updatedTable: TableSelectable) => {
    updateTables((t) =>
      t.name === updatedTable.name ? updatedTable : t
    )
  }

  const isAllSelected = state.tables.every((table) => table.isSelected)

  const handleSelectAll = () => {
    updateTables((t) => ({ ...t, isSelected: !isAllSelected }))
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-2 p-4 overflow-y-auto">
        {state.tables.map((table) => (
          <TableAccordion
            key={table.name}
            table={table}
            isSelected={table.isSelected}
            onCheckboxChange={() => handleCheckboxChange(table)}
            onSchemaChange={handleSchemaChange}
          />
        ))}
      </div>
      <div className="flex justify-between items-center w-full border-t p-2">
        <div className="flex flex-wrap gap-2">
          Selected Tables:
          {state.tables.filter(table => table.isSelected).map((table) => (
            <span key={table.name} className="px-2 py-1 bg-green-100 text-green-800 rounded">
              {table.name}
            </span>
          ))}
        </div>
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
    </div>
  )
}

function TableAccordion({
  table,
  isSelected,
  onCheckboxChange,
  onSchemaChange,
}: {
  table: TableSelectable
  isSelected: boolean
  onCheckboxChange: () => void
  onSchemaChange: (table: TableSelectable) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded">
      <div
        className="flex items-center justify-between p-2 bg-gray-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 cursor-pointer accent-green-300"
          />
          <span className="ml-2 font-semibold">{table.name}</span>
        </div>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="p-2">
          <CodeDisplay
            code={table.schema}
            onCodeChange={(newCode) => onSchemaChange({ ...table, schema: newCode })}
          />
        </div>
      )}
    </div>
  )
}
