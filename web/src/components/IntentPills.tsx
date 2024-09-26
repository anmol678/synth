import React from 'react'
import { Intent } from '@/types'
import Button from '@/components/Button'

interface IntentPillsProps {
  intents: Intent[]
  activeIntent: Intent | null
  onSetIntent: (intent: Intent) => void
  loading: boolean
}

export default function IntentPills({ intents, activeIntent, onSetIntent, loading }: IntentPillsProps) {
  return (
    <div className="flex -ml-0.5 space-x-2">
      {intents.map((intent) => (
        <Button
          key={intent}
          onClick={() => onSetIntent(intent)}
          disabled={loading}
          data-variant='pill'
          data-selected={intent === activeIntent}
        >
          {intent}
        </Button>
      ))}
    </div>
  )
}
