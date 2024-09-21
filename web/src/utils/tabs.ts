import TableSchemaTab from '@/components/TableSchemaTab'
import ScriptTab from '@/components/ScriptTab'
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
}

export default Tabs
