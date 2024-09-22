import { useMemo } from 'react'
import { TableSelectable, ActionType } from '@/types'
import TableAccordion from '@/components/TableAccordion'
import { useAppContext } from '@/context'

export default function TableSchemaTab() {
  const { state, dispatch } = useAppContext()

  const updateTables = (updateFn: (table: TableSelectable) => TableSelectable) => {
    const updatedTables = state.tables.map(updateFn)
    dispatch({ type: ActionType.SET_TABLES, payload: updatedTables })
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

  const isAllSelected = useMemo(() => state.tables.every((table) => table.isSelected), [state.tables])

  const handleSelectAll = () => {
    updateTables((t) => ({ ...t, isSelected: !isAllSelected }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-2 p-4">
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
      <div className="flex-shrink-0 flex justify-between items-center w-full border-t-2 p-2 min-h-20 bg-white">
        <div className="flex flex-col gap-2 h-full">
          <span className="text-sm font-semibold text-gray-700 self-start">Selected Tables</span>
          <div className="flex flex-wrap gap-2">
            {state.tables.filter(table => table.isSelected).map((table) => (
              <span key={table.name} className="px-2 py-1 bg-green-100 text-green-800 rounded h-8">
                {table.name}
              </span>
            ))}
          </div>
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
