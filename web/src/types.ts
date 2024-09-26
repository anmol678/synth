export interface Table {
  name: string
  schema: string
}

interface Selectable {
  isSelected: boolean
}

export interface TableSelectable extends Table, Selectable {}

export enum MessageSender {
  User = 'user',
  Assistant = 'assistant',
}

export interface Message {
  id: string
  content: string
  sender: MessageSender
}

export interface AppState {
  tables: TableSelectable[]
  dataGenerationScript: string
  messages: Message[]
  loading: boolean
  activeTab: Tab | null
  intent: Intent
  testResults: Record<string, any[]> | null
}

export enum IntentType {
  GenerateSchema = 'GenerateSchema',
  UpdateSchema = 'UpdateSchema',
  GenerateScript = 'GenerateScript',
  UpdateScript = 'UpdateScript',
  None = 'None',
}

export interface Intent {
  type: IntentType
  label: string
}

export interface Tab {
  name: string
  component: React.ComponentType
}

export enum ActionType {
  BATCH_UPDATE = 'BATCH_UPDATE',
  RESET = 'RESET',
  SET_TABLES = 'SET_TABLES',
  SET_SCRIPT = 'SET_SCRIPT',
  ADD_MESSAGE = 'ADD_MESSAGE',
  SET_LOADING = 'SET_LOADING',
  SET_ACTIVE_TAB = 'SET_ACTIVE_TAB',
  SET_INTENT = 'SET_INTENT',
}

export type Action =
  | { type: ActionType.BATCH_UPDATE; payload: Partial<AppState> }
  | { type: ActionType.RESET, payload: null }
  | { type: ActionType.SET_TABLES; payload: TableSelectable[] }
  | { type: ActionType.SET_SCRIPT; payload: string }
  | { type: ActionType.ADD_MESSAGE; payload: Message }
  | { type: ActionType.SET_LOADING; payload: boolean }
  | { type: ActionType.SET_ACTIVE_TAB; payload: Tab }
  | { type: ActionType.SET_INTENT; payload: Intent }
