'use client'

import { isPosthogReady } from '@/lib/analytics'
import { isPosthogEnabled } from '@/provider/AnalyticsProvider'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type PropsWithChildren } from 'react'

type RequestRefresh = (reason?: string) => void

const FeatureFlagsRefreshContext = createContext<RequestRefresh | null>(null)

const FLAGS_REFRESH_THROTTLE_MS = 120_000

export function PosthogFeatureFlagsRefreshProvider({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastFlagReloadAtRef = useRef(0)

  const requestRefresh = useCallback<RequestRefresh>(() => {
    if (typeof window === 'undefined') return
    if (!isPosthogReady() || !isPosthogEnabled) return
    if (posthog.has_opted_out_capturing?.()) return

    const now = Date.now()
    if (now - lastFlagReloadAtRef.current < FLAGS_REFRESH_THROTTLE_MS) return
    lastFlagReloadAtRef.current = now

    posthog.reloadFeatureFlags?.()
  }, [])

  useEffect(() => {
    requestRefresh()
  }, [pathname, searchParams, requestRefresh])

  const value = useMemo(() => requestRefresh, [requestRefresh])

  return <FeatureFlagsRefreshContext.Provider value={value}>{children}</FeatureFlagsRefreshContext.Provider>
}

/**
 * Feature flag refresh'ini tek noktadan yöneten provider'dan "refresh isteği" alır.
 * - `refreshKey` verilirse, bu değer değiştiğinde (ör. dialog open/close) otomatik refresh ister.
 */
export function usePosthogFeatureFlagsRefresh(refreshKey?: unknown) {
  const contextRefresh = useContext(FeatureFlagsRefreshContext)
  const requestRefresh = useMemo<RequestRefresh>(() => contextRefresh ?? (() => {}), [contextRefresh])
  const isFirstRunRef = useRef(true)

  useEffect(() => {
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false
      return
    }

    // Sipariş detayı gibi "açıldı" sinyallerinde tetiklemek istiyoruz.
    // `refreshKey` null/undefined ise (örn. dialog kapandı) refresh isteme.
    if (refreshKey == null) return

    requestRefresh()
  }, [refreshKey, requestRefresh])

  return requestRefresh
}
