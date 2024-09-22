import { useState } from 'react'
import { TableSelectable } from '@/types'
import CodeDisplay from '@/components/CodeDisplay'

interface TableAccordionProps {
  table: TableSelectable
  isSelected: boolean
  onCheckboxChange: () => void
  onSchemaChange: (updatedTable: TableSelectable) => void
}

export default function TableAccordion({ table, isSelected, onCheckboxChange, onSchemaChange }: TableAccordionProps) {
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
            checked={isSelected || false}
            onChange={(e) => {
              e.stopPropagation()
              onCheckboxChange()
            }}
            onClick={(e) => {
              e.stopPropagation()
            }}
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
