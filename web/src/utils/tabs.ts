import { lazy } from 'react'
import { Tab } from '@/types'

const TableSchemaTab = lazy(() => import('@/components/TableSchemaTab'))
const ScriptTab = lazy(() => import('@/components/ScriptTab'))
const TestResultsTab = lazy(() => import('@/components/TestResultsTab'))

const Tabs: Record<string, Tab> = {
  Tables: {
    name: 'Tables',
    component: TableSchemaTab,
  },
  Script: {
    name: 'Script',
    component: ScriptTab,
  },
  TestResults: {
    name: 'Test Results',
    component: TestResultsTab,
  },
}

export default Tabs
