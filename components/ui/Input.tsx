'use client'

import { FC, InputHTMLAttributes, useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const Input: FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          px-4 py-2 rounded-lg
          bg-card border border-border
          text-text-primary placeholder-text-muted
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
          transition-colors duration-200
          ${error ? 'border-red-500' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
