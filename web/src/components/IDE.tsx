import { createElement } from 'react'
import TabsView from '@/components/TabsView'
import { useIDE } from '@/hooks/useIDE'

export default function IDE() {
  const { tabs, activeTab, onSetActiveTab } = useIDE()

  if (!activeTab) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <TabsView tabs={tabs} activeTab={activeTab} onSetActiveTab={onSetActiveTab} />
      <div className="flex-1 overflow-y-auto">
        {createElement(activeTab.component)}
      </div>
    </div>
  )
}
