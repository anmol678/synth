"use client"

import { useState } from 'react'
import TabView from '@/components/TabView'
import SchemaGenerator from '@/components/SchemaGenerator'
import ScriptGenerator from '@/components/ScriptGenerator'
import DataGenerator from '@/components/DataGenerator'
import { Table } from '@/types'

export default function Home() {
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTables, setSelectedTables] = useState<Table[]>([])
  const [dataGenerationScript, setDataGenerationScript] = useState('')

  const handleSchemaGeneration = (tables: Table[]) => {
    setTables(tables)
    setSelectedTables([])
  }

  const handleScriptGeneration = (script: string) => {
    setDataGenerationScript(script)
  }

  const handleTableSelection = (selected: Table[]) => {
    setSelectedTables(selected)
  }


  return (
    <main className="p-8">

      <SchemaGenerator onSchemaGenerated={handleSchemaGeneration} />

      {tables.length > 0 && (
        <>
          <TabView
            tables={tables}
            selectedTables={selectedTables}
            onSelectionChange={handleTableSelection}
          />
          <ScriptGenerator
            selectedTables={selectedTables}
            onScriptGenerated={handleScriptGeneration}
            disabled={selectedTables.length === 0}
          />
        </>
      )}

      {dataGenerationScript && (
        <DataGenerator
          dataGenerationScript={dataGenerationScript}
          setDataGenerationScript={setDataGenerationScript}
          selectedTables={selectedTables}
        />
      )}
    </main>
  )
}