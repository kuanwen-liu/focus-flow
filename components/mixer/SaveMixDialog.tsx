'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SaveMixDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, tags: string[]) => void
  defaultName?: string
}

export function SaveMixDialog({ isOpen, onClose, onSave, defaultName = '' }: SaveMixDialogProps) {
  const [mixName, setMixName] = useState(defaultName)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    // Validate mix name
    if (!mixName.trim()) {
      setError('Mix name is required')
      return
    }

    if (mixName.length > 100) {
      setError('Mix name must be 100 characters or less')
      return
    }

    // Save the mix
    onSave(mixName.trim(), tags)

    // Reset form
    setMixName('')
    setTags([])
    setTagInput('')
    setError(null)
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (tagInput.trim()) {
        handleAddTag()
      } else {
        handleSave()
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Dialog */}
        <motion.div
          className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Save Mix</h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Mix Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Mix Name *
            </label>
            <input
              type="text"
              value={mixName}
              onChange={(e) => {
                setMixName(e.target.value)
                setError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Deep Work - Rainy"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(19,182,236,0.2)] transition-all"
              maxLength={100}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            <p className="text-text-secondary text-xs mt-2">
              {mixName.length}/100 characters
            </p>
          </div>

          {/* Tags Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tags (Optional)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-all"
                disabled={tags.length >= 10}
              />
              <button
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 10}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>

            {/* Tag Pills */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-text-secondary text-xs mt-2">
              {tags.length}/10 tags
            </p>
          </div>

          {/* Suggested Tags */}
          <div className="mb-6">
            <p className="text-sm text-text-secondary mb-2">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {['Focus', 'Sleep', 'Nature', 'Meditation', 'Work'].map((suggestedTag) => (
                <button
                  key={suggestedTag}
                  onClick={() => {
                    if (!tags.includes(suggestedTag) && tags.length < 10) {
                      setTags([...tags, suggestedTag])
                    }
                  }}
                  disabled={tags.includes(suggestedTag) || tags.length >= 10}
                  className="px-3 py-1 text-sm bg-background border border-border rounded-full text-text-secondary hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  #{suggestedTag}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-background border border-border rounded-lg text-text-primary font-medium hover:border-primary transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSave}
              disabled={!mixName.trim()}
              className="flex-1 px-6 py-3 bg-primary text-dark rounded-lg font-medium hover:shadow-[0_0_20px_rgba(19,182,236,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Mix
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
