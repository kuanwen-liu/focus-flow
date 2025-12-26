// lib/validation/layerValidation.ts

import { SoundLayer } from '@/types/sound'
import { ValidationResult } from './mixValidation'

export function validateLayer(layer: SoundLayer): ValidationResult {
  const errors: string[] = []

  if (!layer.soundId) {
    errors.push('Layer must reference a sound')
  }

  if (typeof layer.volume !== 'number' || layer.volume < 0 || layer.volume > 1) {
    errors.push('Layer volume must be a number between 0.0 and 1.0')
  }

  if (typeof layer.enabled !== 'boolean') {
    errors.push('Layer enabled must be boolean')
  }

  if (typeof layer.solo !== 'boolean') {
    errors.push('Layer solo must be boolean')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
