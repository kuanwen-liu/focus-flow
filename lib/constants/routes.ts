// lib/constants/routes.ts

export const ROUTES = {
  HOME: '/',
  MIXER: '/mixer',
  LIBRARY: '/library',
  EDIT: (mixId: string) => `/edit/${mixId}`,
} as const
