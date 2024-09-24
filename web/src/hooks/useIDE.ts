import { useMemo, useCallback } from 'react'
import { Tab, ActionType } from '@/types'
import { useAppContext } from '@/context'
import Tabs from '@/utils/tabs'

export const useIDE = () => {
  const { state, dispatch } = useAppContext()

  const tabs = useMemo(() => {
    return [
      state.tables.length > 0 && Tabs.Tables,
      state.dataGenerationScript && Tabs.Script,
      state.testResults && Tabs.TestResults,
    ].filter(Boolean) as Tab[]
  }, [state.tables.length, state.dataGenerationScript, state.testResults])

  const setActiveTab = useCallback((tab: Tab) => {
    dispatch({ type: ActionType.SET_ACTIVE_TAB, payload: tab })
  }, [dispatch])

  return {
    tabs,
    activeTab: state.activeTab,
    setActiveTab,
  }
}
