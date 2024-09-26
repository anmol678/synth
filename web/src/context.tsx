'use client'

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { AppState, Message, MessageSender, Action, ActionType, Intent } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { generateSchema, updateSchema, generateScript, updateScript } from '@/actions'
import Tabs from '@/utils/tabs'

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
  activeTab: null,
  intent: Intent.GenerateSchema,
  testResults: null,
}

const AppContext = createContext<AppContextType | null>(null)

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.BATCH_UPDATE:
      return { ...state, ...action.payload }
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
    const intent = state.intent
    if (!intent) {
      addMessage('Select an intent to generate a response.', MessageSender.Assistant)
      return
    }

    const message = input.trim() || intent
    addMessage(message, MessageSender.User);

    dispatch({ type: ActionType.SET_LOADING, payload: true })
    try {
      let updates: Partial<AppState> = {}
      let botResponseContent = ''

      switch (intent) {
        case Intent.GenerateSchema: {
          const response = await generateSchema(input)
          updates = {
            tables: response.tables.map(table => ({ ...table, isSelected: false })),
            activeTab: Tabs.Tables,
            intent: Intent.GenerateScript,
          }
          botResponseContent = 'Schema generated successfully.'
          break
        }
        case Intent.GenerateScript: {
          const selectedTables = state.tables.filter((table) => table.isSelected)
          if (selectedTables.length === 0) {
            botResponseContent = 'Select at least one table to generate script.'
          } else {
            const response = await generateScript(input, selectedTables)
            updates = {
              dataGenerationScript: response.script,
              activeTab: Tabs.Script,
              intent: null,
            }
            botResponseContent = 'Script generated successfully.'
          }
          break
        }
        case Intent.UpdateSchema: {
          const response = await updateSchema(input, state.tables)
          updates = {
            tables: response.tables.map(table => ({ ...table, isSelected: false })),
            activeTab: Tabs.Tables,
            dataGenerationScript: '',
            testResults: null,
            intent: Intent.GenerateScript,
          }
          botResponseContent = 'Schema updated successfully.'
          break
        }
        case Intent.UpdateScript: {
          const selectedTables = state.tables.filter((table) => table.isSelected)
          const response = await updateScript(input, state.dataGenerationScript, selectedTables)
          updates = {
            dataGenerationScript: response.script,
            activeTab: Tabs.Script,
            testResults: null,
            intent: null,
          }
          botResponseContent = 'Script updated successfully.'
          break
        }
      }

      dispatch({ type: ActionType.BATCH_UPDATE, payload: updates })
      addMessage(botResponseContent, MessageSender.Assistant)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      addMessage(`Error: ${errorMessage}`, MessageSender.Assistant)
    } finally {
      dispatch({ type: ActionType.SET_LOADING, payload: false })
    }
  }, [state.intent, state.tables, state.dataGenerationScript, addMessage, dispatch])

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
