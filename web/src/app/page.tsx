"use client"

import { useState } from 'react'
import TabView from '@/components/TabView'
import SchemaGenerator from '@/components/SchemaGenerator'
import ScriptGenerator from '@/components/ScriptGenerator'
import CodeDisplay from '@/components/CodeDisplay'
import { Table } from '@/types'
// import { executeScript } from '@/actions'

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

  const handleTestRun = async () => {
    // Implement test run functionality
    alert('Test run functionality not implemented yet')
  }

  // const handleExecuteScript = async () => {
  //   setIsLoading(true)
  //   try {
  //     await executeScript(dataGenerationScript)
  //     alert('Data generation completed successfully')
  //   } catch (error) {
  //     setError('Failed to execute data generation. Please try again.')
  //     console.error(error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

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
        <CodeDisplay
          code={dataGenerationScript}
          onCodeChange={setDataGenerationScript}
        // actions={[
        //   { label: 'Test Run', onClick: handleTestRun },
        //   { label: 'Execute Script', onClick: handleExecuteScript },
        // ]}
        />
      )}
    </main>
  )
}