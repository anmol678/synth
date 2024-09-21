export interface Table {
  name: string
  schema: string
}

interface Selectable {
  isSelected: boolean
}

export interface TableSelectable extends Table, Selectable {}

export interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
}

export interface AppState {
  tables: TableSelectable[]
  dataGenerationScript: string
  messages: Message[]
  loading: boolean
  error: string | null
  activeTab: Tab | null
  intent: Intent | null
}

export interface Intent {
  value: string
  label: string
}

export interface Tab {
  name: string
  component: React.ComponentType
}