'use client'

import posthog from 'posthog-js'

import type { AnalyticsEventName, AnalyticsEventPayload } from './events'
import { NormalizedSearch } from './types'

/**
 * Posthog'un yüklü ve kullanıma hazır olup olmadığını kontrol eder.
 * Sadece tarayıcı ortamında ve posthog yüklenmişse true döner.
 */
export const isPosthogReady = () =>
  typeof window !== 'undefined' && Boolean((posthog as unknown as { __loaded?: boolean }).__loaded)

/**
 * Analitik platformuna bir event gönderir.
 * Etkinlik ismini ve isteğe bağlı payload verisini alır.
 */
export function track<TPayload extends AnalyticsEventPayload<AnalyticsEventName>>(
  event: AnalyticsEventName,
  props?: TPayload
) {
  if (!isPosthogReady()) return
  posthog.capture(event, props)
}

/**
 * Search alanından gelen değeri normalize eder.
 * Trim uygular, uzunluğunu ve tipini ('empty', 'numeric', 'text') tespit eder.
 */
export function normalizeSearch(value: string | undefined): NormalizedSearch {
  const trimmed = value?.trim() ?? ''
  const type = trimmed.length === 0 ? 'empty' : /^\d+$/.test(trimmed) ? 'numeric' : 'text'
  return { length: trimmed.length, type }
}
