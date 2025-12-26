// lib/constants/colors.ts

// Constitution color palette (exact hex values)
export const COLORS = {
  primary: '#13b6ec',
  backgroundDark: '#101d22',
  cardDark: '#1c292f',
  borderDark: '#283539',
  borderLight: '#3b4d54',
  textPrimary: '#ffffff',
  textSecondary: '#b8c5cb',
  textMuted: '#7a8a91',
} as const

// Category color mapping for sound icons
export const CATEGORY_COLORS: Record<string, string> = {
  rain: 'blue',
  thunder: 'purple',
  waves: 'cyan',
  wind: 'cyan',
  fire: 'orange',
  birds: 'green',
  crickets: 'green',
  'coffee-shop': 'amber',
  'singing-bowl': 'purple',
  'white-noise': 'gray',
}
