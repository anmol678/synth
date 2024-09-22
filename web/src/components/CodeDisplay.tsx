import React from 'react'

interface CodeDisplayProps {
  code: string
  onCodeChange: (newCode: string) => void
  variant?: 'default' | 'full'
}

export default function CodeDisplay({ code, onCodeChange, variant = 'default' }: CodeDisplayProps) {
  let baseStyle = 'flex-1 w-full font-mono resize-none'

  switch (variant) {
    case 'full':
      baseStyle += ' h-full px-8 py-6 focus:outline-none'
      break
    case 'default':
    default:
      baseStyle += ' min-h-64 h-fit p-2'
      break
  }

  return (
    <textarea
      value={code}
      onChange={(e) => onCodeChange(e.target.value)}
      className={baseStyle}
    />
  )
}