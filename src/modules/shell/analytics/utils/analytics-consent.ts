import { getOrDefault, removeItem, setItem } from '@/lib/local-storage-helper'

export const ANALYTICS_CONSENT_STORAGE_KEY = 'analytics_consent'

export type AnalyticsConsent = 'granted' | 'denied' | null

interface AnalyticsConsentStorage {
  consent: AnalyticsConsent
  expires: number | undefined
}

/**
 * Analytics consent'i storage'da "granted" ise true, "denied" ise false döner.
 * @returns Analytics consent'i varsa true, yoksa false.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  return getAnalyticsConsent() === 'granted'
}

/**
 * Analytics consent'i storage'dan okur.
 * @returns Analytics consent'i varsa "granted" veya "denied", yoksa null döner.
 */
export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return null

  const { consent, expires } = getOrDefault<AnalyticsConsentStorage>(ANALYTICS_CONSENT_STORAGE_KEY, {
    consent: null,
    expires: undefined
  })
  if (expires && expires < Date.now()) return null
  return consent
}

/**
 * Analytics consent'i storage'a kaydeder.
 * "denied" ise 1 gün sonra otomatik olarak silinir.
 * @param consent - Analytics consent'i.
 */
export function setAnalyticsConsent(consent: Exclude<AnalyticsConsent, null>): void {
  if (typeof window === 'undefined') return

  const expires = consent === 'denied' ? Date.now() + 1000 * 60 * 60 * 24 : undefined // 1 gün
  setItem(ANALYTICS_CONSENT_STORAGE_KEY, { consent, expires })
}

/**
 * Analytics consent'i storage'dan siler.
 */
export function clearAnalyticsConsent(): void {
  if (typeof window === 'undefined') return
  removeItem(ANALYTICS_CONSENT_STORAGE_KEY)
}
