export const APP_VERSION =
  process.env.NODE_ENV === 'production' ? (process.env.NEXT_PUBLIC_APP_VERSION ?? 'unreleased') : 'development'
