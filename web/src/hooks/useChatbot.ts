import { useMemo, useCallback } from 'react'
import { IntentType, Intent, ActionType } from '@/types'
import { useAppContext } from '@/context'
import Intents from '@/utils/intents'

export const useChatbot = () => {
  const { state, sendMessage, dispatch } = useAppContext()

  const handleSendMessage = useCallback((input: string) => {
    sendMessage(input)
  }, [sendMessage])

  const handleSetIntent = useCallback((intent: Intent) => {
    dispatch({ type: ActionType.SET_INTENT, payload: intent })
  }, [dispatch])

  const intents = useMemo(() => {
    return [
      state.tables.length === 0 && Intents[IntentType.GenerateSchema],
      state.tables.length > 0 && Intents[IntentType.UpdateSchema],
      state.tables.length > 0 && !state.dataGenerationScript && Intents[IntentType.GenerateScript],
      state.dataGenerationScript && Intents[IntentType.UpdateScript],
    ].filter(Boolean) as Intent[]
  }, [state.tables.length, state.dataGenerationScript])

  return {
    messages: state.messages,
    sendMessage: handleSendMessage,
    loading: state.loading,
    activeIntent: state.intent,
    onSetIntent: handleSetIntent,
    intents,
  }
}
