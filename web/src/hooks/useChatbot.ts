import { useMemo, useCallback } from 'react'
import { Intent, ActionType } from '@/types'
import { useAppContext } from '@/context'

export const useChatbot = () => {
  const { state, sendMessage, dispatch } = useAppContext()

  const handleSendMessage = useCallback((input: string) => {
    sendMessage(input)
  }, [sendMessage])

  const handleSetIntent = useCallback((intent: Intent) => {
    dispatch({ type: ActionType.SET_INTENT, payload: intent })
  }, [dispatch])

  const handleReset = useCallback(() => {
    dispatch({ type: ActionType.RESET, payload: null })
  }, [dispatch])

  const intents = useMemo(() => {
    return [
      state.tables.length === 0 && Intent.GenerateSchema,
      state.tables.length > 0 && Intent.UpdateSchema,
      state.tables.length > 0 && !state.dataGenerationScript && Intent.GenerateScript,
      state.dataGenerationScript && Intent.UpdateScript,
    ].filter(Boolean) as Intent[]
  }, [state.tables.length, state.dataGenerationScript])

  return {
    messages: state.messages,
    onSendMessage: handleSendMessage,
    loading: state.loading,
    activeIntent: state.intent,
    onSetIntent: handleSetIntent,
    intents,
    onReset: handleReset,
  }
}
