// lib/constants/routes.ts

export const ROUTES = {
  HOME: '/',
  MIXER: '/mixer',
  SAVED_MIXES: '/saved-mixes',
  EDIT: (mixId: string) => `/edit/${mixId}`,
} as const
