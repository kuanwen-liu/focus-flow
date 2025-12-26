// lib/validation/mixValidation.ts

import { Mix } from '@/types/mix'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateMix(mix: Mix): ValidationResult {
  const errors: string[] = []

  // Name validation
  if (!mix.name || mix.name.trim().length === 0) {
    errors.push('Mix name is required')
  }
  if (mix.name.length > 100) {
    errors.push('Mix name must be 100 characters or less')
  }

  // Layers validation
  if (!mix.layers || mix.layers.length === 0) {
    errors.push('Mix must have at least one layer')
  }
  if (mix.layers.length > 10) {
    errors.push('Mix cannot have more than 10 layers')
  }

  // Layer-specific validation
  mix.layers.forEach((layer, index) => {
    if (!layer.soundId) {
      errors.push(`Layer ${index + 1}: soundId is required`)
    }
    if (layer.volume < 0 || layer.volume > 100) {
      errors.push(`Layer ${index + 1}: volume must be between 0 and 100`)
    }
  })

  // Tags validation
  if (mix.tags && mix.tags.length > 10) {
    errors.push('Mix cannot have more than 10 tags')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
