'use client'

import dynamic from 'next/dynamic'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import React, { Suspense, useEffect } from 'react'

import { isPosthogReady } from '@/lib/analytics'
import { maskString } from '@/lib/utils/mask'
import { usePosthogConsentGate } from '@/modules/analytics/hooks/usePosthogConsentGate'
import { PosthogFeatureFlagsRefreshProvider } from '@/modules/analytics/hooks/usePosthogFeatureFlagsRefresh'
import { APP_VERSION } from '@/version'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

const AnalyticsConsentBanner = dynamic(
  () => import('@/modules/analytics/components/AnalyticsConsentBanner').then(m => m.AnalyticsConsentBanner),
  { ssr: false }
)

function AnalyticsProviderInner({ children }: { children: React.ReactNode }) {
  const { showConsentBanner } = usePosthogConsentGate()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isPosthogReady()) return
    if (posthog.has_opted_out_capturing?.()) return

    posthog.capture('$pageview', { $current_url: window.location.href })
  }, [pathname, searchParams])

  return (
    <PosthogFeatureFlagsRefreshProvider>
      {children}
      {showConsentBanner && <AnalyticsConsentBanner />}
    </PosthogFeatureFlagsRefreshProvider>
  )
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!posthogKey) return
    if (isPosthogReady()) return

    posthog.init(posthogKey, {
      api_host: posthogHost || 'https://eu.i.posthog.com',
      person_profiles: 'always',
      capture_pageview: false, // SPA/App Router: route değişiminde manuel $pageview capture ediyoruz
      capture_pageleave: true,
      opt_out_capturing_by_default: false,
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false
      },
      session_recording: {
        maskAllInputs: true,
        maskInputFn: text => '*'.repeat(text.length),
        maskTextSelector: '.ph-sensitive',
        maskTextFn: text => maskString(text, { visibleStart: 1, visibleEnd: 1, maskChar: '*' })
      },
      debug: process.env.NODE_ENV === 'development',
      loaded: ph => {
        ph.register({
          app_version: APP_VERSION
        })
      }
    })
  }, [])

  if (!posthogKey) return <>{children}</>

  return (
    <Suspense fallback={<>{children}</>}>
      <PostHogProvider client={posthog}>
        <AnalyticsProviderInner>{children}</AnalyticsProviderInner>
      </PostHogProvider>
    </Suspense>
  )
}
