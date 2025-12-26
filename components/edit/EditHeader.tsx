'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface EditHeaderProps {
  mixName: string
  onNameChange: (name: string) => void
  hasUnsavedChanges?: boolean
}

export function EditHeader({ mixName, onNameChange, hasUnsavedChanges = false }: EditHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localName, setLocalName] = useState(mixName)
  const [error, setError] = useState<string | null>(null)

  // Sync local name when prop changes
  useEffect(() => {
    setLocalName(mixName)
  }, [mixName])

  const handleSaveName = () => {
    if (!localName.trim()) {
      setError('Mix name cannot be empty')
      return
    }

    if (localName.length > 100) {
      setError('Mix name must be 100 characters or less')
      return
    }

    onNameChange(localName.trim())
    setIsEditing(false)
    setError(null)
  }

  const handleCancel = () => {
    setLocalName(mixName)
    setIsEditing(false)
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Mix Name */}
        <div className="flex-1">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={localName}
                onChange={(e) => {
                  setLocalName(e.target.value)
                  setError(null)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter mix name..."
                className="w-full text-3xl md:text-4xl font-bold text-text-primary bg-background border-b-2 border-primary focus:outline-none pb-1"
                maxLength={100}
                autoFocus
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveName}
                    className="px-4 py-1 bg-primary text-dark rounded-lg text-sm font-medium hover:shadow-[0_0_15px_rgba(19,182,236,0.4)] transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-1 bg-background border border-border text-text-secondary rounded-lg text-sm font-medium hover:border-primary transition-all"
                  >
                    Cancel
                  </button>
                </div>
                <span className="text-xs text-text-secondary">
                  {localName.length}/100
                </span>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                {mixName}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="text-text-secondary hover:text-primary transition-colors"
                title="Edit name"
              >
                <span className="material-symbols-outlined text-2xl">edit</span>
              </button>
            </div>
          )}
        </div>

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && !isEditing && (
          <motion.div
            className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-orange-500 text-xs font-medium">Unsaved Changes</span>
          </motion.div>
        )}
      </div>

      <p className="text-text-secondary mt-2">
        Edit your mix by adjusting volumes, adding or removing sounds
      </p>
    </motion.div>
  )
}
