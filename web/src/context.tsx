'use client'

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { AppState, Message, MessageSender, Action, ActionType, IntentType } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { generateSchema, generateScript } from '@/actions'
import Tabs from '@/utils/tabs'
import Intents from '@/utils/intents'

type AppContextType = {
  state: AppState
  dispatch: React.Dispatch<Action>
  sendMessage: (input: string) => Promise<void>
}

const initialState: AppState = {
  tables: [],
  dataGenerationScript: '',
  messages: [],
  loading: false,
  error: null,
  activeTab: null,
  intent: Intents[IntentType.GenerateSchema],
}

const AppContext = createContext<AppContextType | null>(null)

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.RESET:
      return initialState
    case ActionType.SET_TABLES:
      return { ...state, tables: action.payload }
    case ActionType.SET_SCRIPT:
      return { ...state, dataGenerationScript: action.payload }
    case ActionType.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] }
    case ActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case ActionType.SET_ERROR:
      return { ...state, error: action.payload }
    case ActionType.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload }
    case ActionType.SET_INTENT:
      return { ...state, intent: action.payload }
    default:
      return state
  }
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const addMessage = useCallback((message: string, sender: MessageSender) => {
    const newMessage: Message = {
      id: uuidv4(),
      content: message,
      sender,
    }
    dispatch({ type: ActionType.ADD_MESSAGE, payload: newMessage })
  }, [dispatch])

  const sendMessage = useCallback(async (input: string) => {
    const intent = state.intent?.type || IntentType.None
    addMessage(input.trim() || Intents[intent].label || '...', MessageSender.User);

    dispatch({ type: ActionType.SET_LOADING, payload: true })
    try {
      let botResponseContent = ''

      switch (intent) {
        case IntentType.GenerateSchema: {
          const response = await generateSchema(input)
          dispatch({ type: ActionType.SET_TABLES, payload: response.tables })
          dispatch({ type: ActionType.SET_ACTIVE_TAB, payload: Tabs.Tables })
          dispatch({ type: ActionType.SET_INTENT, payload: Intents.GenerateScript })
          botResponseContent = 'Schema generated successfully.'
          addMessage(botResponseContent, MessageSender.Assistant)
          break
        }
        case IntentType.GenerateScript: {
          const selectedTables = state.tables.filter((table) => table.isSelected)
          if (selectedTables.length === 0) {
            botResponseContent = 'Select at least one table to generate script.'
          } else {
            const response = await generateScript(input, selectedTables)
            dispatch({ type: ActionType.SET_SCRIPT, payload: response.script })
            dispatch({ type: ActionType.SET_ACTIVE_TAB, payload: Tabs.Script })
            dispatch({ type: ActionType.SET_INTENT, payload: Intents.None })
            botResponseContent = 'Script generated successfully.'
          }
          addMessage(botResponseContent, MessageSender.Assistant)
          break
        }
        case IntentType.UpdateSchema: {
          // TODO: use update func instead of generating new
          // const response = await generateSchema(input)
          // dispatch({ type: 'SET_TABLES', payload: response.tables })
          // dispatch({ type: 'SET_ACTIVE_TAB', payload: Tabs.Tables })
          // dispatch({ type: 'SET_SCRIPT', payload: '' })
          // botResponseContent = 'Schema updated successfully.'
          setTimeout(() => {
            dispatch({ type: ActionType.SET_INTENT, payload: Intents.None })
            botResponseContent = 'This feature is not available yet.'
            addMessage(botResponseContent, MessageSender.Assistant)
          }, 1000)
          break
        }
        case IntentType.UpdateScript: {
          // TODO: use update func instead of generating new
          // const response = await generateScript(input, state.tables)
          // dispatch({ type: 'SET_SCRIPT', payload: response.script })
          // dispatch({ type: 'SET_ACTIVE_TAB', payload: Tabs.Script })
          // botResponseContent = 'Script updated successfully.'
          setTimeout(() => {
            dispatch({ type: ActionType.SET_INTENT, payload: Intents.None })
            botResponseContent = 'This feature is not available yet.'
            addMessage(botResponseContent, MessageSender.Assistant)
          }, 1000)
          break
        }
        default: {
          break
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorContent = `Error: ${errorMessage}`
      addMessage(errorContent, MessageSender.Assistant)
      dispatch({ type: ActionType.SET_ERROR, payload: errorMessage })
    } finally {
      dispatch({ type: ActionType.SET_LOADING, payload: false })
    }
  }, [state.intent, state.tables, dispatch, addMessage])

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    sendMessage,
  }), [state, dispatch, sendMessage])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
