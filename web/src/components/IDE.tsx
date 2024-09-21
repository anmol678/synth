import { useState } from 'react'
import TabsView from '@/components/TabsView'
import TableSchemaTab from '@/components/TableSchemaTab'
import ScriptTab from '@/components/ScriptTab'
import { useAppContext } from '@/context'

export default function IDE() {
  const { state } = useAppContext()

  const tabs = [
    state.tables.length > 0 && 'Tables',
    state.dataGenerationScript && 'Script',
  ].filter(Boolean) as string[]

  const [activeTab, setActiveTab] = useState<string>(tabs[0])

  return (
    <div className="flex flex-col h-full">
      <TabsView tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Tables' && <TableSchemaTab />}
        {activeTab === 'Script' && <ScriptTab />}
      </div>
    </div>
  )
}
