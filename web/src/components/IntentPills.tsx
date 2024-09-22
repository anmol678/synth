import React from 'react'
import { Intent } from '@/types'
import Button from '@/components/Button'

interface IntentPillsProps {
  intents: Intent[]
  activeIntent: Intent
  onSetIntent: (intent: Intent) => void
  loading: boolean
}

export default function IntentPills({ intents, activeIntent, onSetIntent, loading }: IntentPillsProps) {
  return (
    <div className="mb-2 flex space-x-2">
      {intents.map((intent) => (
        <Button
          key={intent.type}
          onClick={() => onSetIntent(intent)}
          variant={intent === activeIntent ? 'primary' : 'secondary'}
          disabled={loading}
          className="px-3 text-sm font-semibold rounded-full"
        >
          {intent.label}
        </Button>
      ))}
    </div>
  )
}