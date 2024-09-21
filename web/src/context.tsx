'use client'

import React, { createContext, useContext, useReducer } from 'react'
import { AppState, TableSelectable, Message, Intent, Tab } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { generateSchema, generateScript } from '@/actions'
import Tabs from '@/utils/tabs'
import Intents from '@/utils/intents'

type Action =
  | { type: 'SET_TABLES'; payload: TableSelectable[] }
  | { type: 'SET_SCRIPT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ACTIVE_TAB'; payload: Tab }
  | { type: 'SET_INTENT'; payload: Intent }
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
  intent: Intents.GenerateSchema,
}

const AppContext = createContext<AppContextType | null>(null)

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TABLES':
      return { ...state, tables: action.payload }
    case 'SET_SCRIPT':
      return { ...state, dataGenerationScript: action.payload }
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'SET_INTENT':
      return { ...state, intent: action.payload }
    default:
      return state
  }
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const addMessage = (message: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      content: message,
      sender: 'user',
    }
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })
  }

  const sendMessage = async (input: string) => {
    const intent = state.intent
    addMessage(input.trim().length ? input : intent?.label || '...')

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      let botResponseContent = ''

      switch (intent) {
        case Intents.GenerateSchema: {
          const response = await generateSchema(input)
          dispatch({ type: 'SET_TABLES', payload: response.tables })
          dispatch({ type: 'SET_ACTIVE_TAB', payload: Tabs.Tables })
          dispatch({ type: 'SET_INTENT', payload: Intents.GenerateScript })
          botResponseContent = 'Schema generated successfully.'
          break
        }
        case Intents.GenerateScript: {
          const selectedTables = state.tables.filter((table) => table.isSelected)
          if (selectedTables.length === 0) {
            botResponseContent = 'Select at least one table to generate script.'
          } else {
            const response = await generateScript(input, selectedTables)
            dispatch({ type: 'SET_SCRIPT', payload: response.script })
            dispatch({ type: 'SET_ACTIVE_TAB', payload: Tabs.Script })
            dispatch({ type: 'SET_INTENT', payload: Intents.None })
            botResponseContent = 'Script generated successfully.'
          }
          break
        }
        case Intents.UpdateSchema: {
          // TODO: use update func instead of generating new
          // const response = await generateSchema(input)
          // dispatch({ type: 'SET_TABLES', payload: response.tables })
          // dispatch({ type: 'SET_ACTIVE_TAB', payload: Tabs.Tables })
          // dispatch({ type: 'SET_SCRIPT', payload: '' })
          // botResponseContent = 'Schema updated successfully.'
          setTimeout(() => {
            dispatch({ type: 'SET_INTENT', payload: Intents.None })
            botResponseContent = 'This feature is not available yet.'
          }, 1000)
          break
        }
        case Intents.UpdateScript: {
          // TODO: use update func instead of generating new
          // const response = await generateScript(input, state.tables)
          // dispatch({ type: 'SET_SCRIPT', payload: response.script })
          // dispatch({ type: 'SET_ACTIVE_TAB', payload: Tabs.Script })
          // botResponseContent = 'Script updated successfully.'
          setTimeout(() => {
            dispatch({ type: 'SET_INTENT', payload: Intents.None })
            botResponseContent = 'This feature is not available yet.'
          }, 1000)
          break
        }
      }

      const botMessage: Message = {
        id: uuidv4(),
        content: botResponseContent,
        sender: 'assistant',
      }
      dispatch({ type: 'ADD_MESSAGE', payload: botMessage })
    } catch (error: any) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: uuidv4(),
          content: `Error: ${error.message}`,
          sender: 'assistant',
        },
      })
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return (
    <AppContext.Provider value={{ state, dispatch, sendMessage }}>
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
