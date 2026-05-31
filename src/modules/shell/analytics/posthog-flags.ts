'use client'

/**
 * PostHog Feature Flag kaydı.
 *
 * Tüm feature flag anahtarlarını tek bir yerde tutarak yazım hatalarını önleyin ve otomatik tamamlamayı etkinleştirin.
 */
export const POSTHOG_FLAGS = {
  showConsentBanner: 'show_consent_banner',
  showLiveSupportChat: 'show_live_support_chat'
} as const

export type PosthogFlagKey = (typeof POSTHOG_FLAGS)[keyof typeof POSTHOG_FLAGS]
