import { useState, useCallback } from 'react'
import { ActionType } from '@/types'
import { executeScript, testRunScript } from '@/actions'
import { useAppContext } from '@/context'
import Tabs from '@/utils/tabs'

export const useScriptTab = () => {
  const { state, dispatch } = useAppContext()
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<string | null>(null)

  const handleTestRun = useCallback(async () => {
    setIsExecuting(true)
    try {
      const selectedTables = state.tables.filter((table) => table.isSelected)
      const response = await testRunScript(state.dataGenerationScript, selectedTables)
      dispatch({
        type: ActionType.BATCH_UPDATE,
        payload: {
          testResults: response.result,
          activeTab: Tabs.TestResults
        }
      })
    } catch (error: unknown) {
      setExecutionResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExecuting(false)
    }
  }, [state.dataGenerationScript, state.tables, dispatch])

  const handleExecuteScript = useCallback(async () => {
    setIsExecuting(true)
    setExecutionResult(null)
    try {
      const selectedTables = state.tables.filter((table) => table.isSelected)
      const response = await executeScript(state.dataGenerationScript, selectedTables)
      setExecutionResult(JSON.stringify(response))
    } catch (error: unknown) {
      setExecutionResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExecuting(false)
    }
  }, [state.dataGenerationScript, state.tables])

  const handleCodeChange = useCallback((code: string) => {
    dispatch({ type: ActionType.SET_SCRIPT, payload: code })
  }, [dispatch])

  return {
    dataGenerationScript: state.dataGenerationScript,
    isExecuting,
    executionResult,
    onTestRun: handleTestRun,
    onExecuteScript: handleExecuteScript,
    onCodeChange: handleCodeChange
  }
}
