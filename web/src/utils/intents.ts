import { Intent } from '@/types'

const Intents: Record<string, Intent> = {
  GenerateSchema: {
    value: 'generateSchema',
    label: 'Generate Schema',
  },
  GenerateScript: {
    value: 'generateScript',
    label: 'Generate Script',
  },
  UpdateSchema: {
    value: 'updateSchema',
    label: 'Update Schema',
  },
  UpdateScript: {
    value: 'updateScript',
    label: 'Update Script',
  },
  None: {
    value: 'none',
    label: 'None',
  },
}

export default Intents
