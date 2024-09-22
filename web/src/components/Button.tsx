import React from 'react'
import { cn } from '@/utils/styles'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'data-style'?: 'primary' | 'secondary' | 'action' | 'danger'
  'data-variant'?: 'small' | 'icon' | 'pill'
  'data-selected'?: boolean
}

export default function Button({ className, ...props }: ButtonProps) {
  return (
    <button className={cn('button', className)} {...props} />
  )
}
