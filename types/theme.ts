// types/theme.ts

export type ThemeMode = 'dark' | 'light'

export interface ThemeState {
  mode: ThemeMode // Current theme mode
  primaryColor: string // Customizable primary color (future)
}
