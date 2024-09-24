import TableSchemaTab from '@/components/TableSchemaTab'
import ScriptTab from '@/components/ScriptTab'
import TestResultsTab from '@/components/TestResultsTab'
import { Tab } from '@/types'

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
