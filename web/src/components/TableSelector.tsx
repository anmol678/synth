import { Table } from '@/types'

interface TableSelectorProps {
  tables: Table[]
  selectedTables: Table[]
  onSelectionChange: (selected: Table[]) => void
}

export default function TableSelector({ tables, selectedTables, onSelectionChange }: TableSelectorProps) {
  const handleCheckboxChange = (table: Table) => {
    const isSelected = selectedTables.some(t => t.name === table.name)
    const newSelection = isSelected
      ? selectedTables.filter(t => t.name !== table.name)
      : [...selectedTables, table]
    onSelectionChange(newSelection)
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Select Tables</h2>
      {tables.map(table => (
        <div key={table.name} className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedTables.some(t => t.name === table.name)}
              onChange={() => handleCheckboxChange(table)}
              className="mr-2"
            />
            {table.name}
          </label>
        </div>
      ))}
    </div>
  )
}