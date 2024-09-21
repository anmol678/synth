'use client'

import React, { createContext, useContext, useReducer } from 'react'
import { AppState, TableSelectable, Message } from '@/types'

type Action =
  | { type: 'SET_TABLES'; payload: TableSelectable[] }
  | { type: 'SET_SCRIPT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

type AppContextType = {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const initialState: AppState = {
  tables: [],
  dataGenerationScript: '',
  messages: [],
  loading: false,
  error: null,
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
    default:
      return state
  }
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
