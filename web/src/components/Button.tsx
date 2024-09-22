import React from 'react'
import { cn } from '@/utils/styles'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  let baseStyle = 'px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2'

  switch (variant) {
    case 'secondary':
      baseStyle += ' bg-gray-200 text-gray-700 hover:bg-gray-300'
      break
    case 'danger':
      baseStyle += ' bg-red-500 text-white hover:bg-red-600'
      break
    case 'primary':
    default:
      baseStyle += ' bg-blue-500 text-white hover:bg-blue-600'
      break
  }

  return (
    <button className={cn(baseStyle, className)} {...props} />
  )
}
