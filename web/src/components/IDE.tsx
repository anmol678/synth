import { createElement } from 'react'
import TabsView from '@/components/TabsView'
import { useAppContext } from '@/context'
import Tabs from '@/utils/tabs'
import { Tab } from '@/types'

export default function IDE() {
  const { state, dispatch } = useAppContext()

  const tabs = [
    state.tables.length > 0 && Tabs.Tables,
    state.dataGenerationScript && Tabs.Script,
  ].filter(Boolean) as Tab[]

  const handleSetActiveTab = (tab: Tab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })
  }

  if (!state.activeTab) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <TabsView tabs={tabs} activeTab={state.activeTab} setActiveTab={handleSetActiveTab} />
      <div className="flex-1 overflow-y-auto">
        {createElement(state.activeTab.component)}
      </div>
    </div>
  )
}
