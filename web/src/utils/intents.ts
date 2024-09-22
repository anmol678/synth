import { Intent, IntentType } from '@/types'

const Intents: Record<IntentType, Intent> = {
  [IntentType.GenerateSchema]: {
    type: IntentType.GenerateSchema,
    label: 'Generate Schema',
  },
  [IntentType.GenerateScript]: {
    type: IntentType.GenerateScript,
    label: 'Generate Script',
  },
  [IntentType.UpdateSchema]: {
    type: IntentType.UpdateSchema,
    label: 'Update Schema',
  },
  [IntentType.UpdateScript]: {
    type: IntentType.UpdateScript,
    label: 'Update Script',
  },
  [IntentType.None]: {
    type: IntentType.None,
    label: 'None',
  },
}

export default Intents
