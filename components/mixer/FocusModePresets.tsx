'use client'

import { FC } from 'react'
import { FocusModePreset } from '@/types/sound'

interface FocusModePresetsProps {
  presets: FocusModePreset[]
  activePresetId: string | null
  onSelectPreset: (presetId: string) => void
}

export const FocusModePresets: FC<FocusModePresetsProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-bold leading-tight tracking-tight text-text-primary">
          Focus Modes
        </h2>
        <a className="text-sm text-primary font-medium hover:underline" href="#">
          View all
        </a>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {presets.map((preset) => {
          const isActive = preset.id === activePresetId

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`group flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-5 transition-all ${
                isActive
                  ? 'bg-primary text-white dark:text-[#111618]'
                  : 'bg-white dark:bg-border hover:bg-gray-100 dark:hover:bg-border-light border border-transparent'
              }`}
            >
              <span
                className={`material-symbols-outlined !text-[20px] ${
                  isActive
                    ? 'text-white dark:text-[#111618]'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'
                }`}
              >
                {preset.icon}
              </span>
              <p
                className={`text-sm leading-normal ${
                  isActive
                    ? 'font-bold text-white dark:text-[#111618]'
                    : 'font-medium text-gray-700 dark:text-gray-200'
                }`}
              >
                {preset.name}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
