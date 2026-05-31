'use client'

import dynamic from 'next/dynamic'
import posthog from 'posthog-js'
import { sampleByEvent } from 'posthog-js/lib/src/customizations'
import { PostHogProvider } from 'posthog-js/react'
import React, { Suspense, useEffect } from 'react'

import { isPosthogReady } from '@/lib/analytics'
import { maskString } from '@/lib/utils/mask'
import { usePosthogConsentGate } from '@/modules/shell/analytics/hooks/usePosthogConsentGate'
import { PosthogFeatureFlagsRefreshProvider } from '@/modules/shell/analytics/hooks/usePosthogFeatureFlagsRefresh'
import { APP_VERSION } from '@/version'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const hasPosthogKey = Boolean(posthogKey && posthogKey.trim() !== '')
export const isPosthogEnabled = Boolean(hasPosthogKey && process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true')
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

const AnalyticsConsentBanner = dynamic(
  () => import('@/modules/shell/analytics/components/AnalyticsConsentBanner').then(m => m.AnalyticsConsentBanner),
  { ssr: false }
)

function AnalyticsProviderInner({ children }: { children: React.ReactNode }) {
  const { showConsentBanner } = usePosthogConsentGate()

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
    if (isPosthogReady() || !isPosthogEnabled) return

    posthog.init(posthogKey, {
      api_host: posthogHost || 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: false,
      before_send: sampleByEvent(['$dead_click', '$web_vitals'], 0.1),
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
      autocapture: false,
      loaded: ph => {
        ph.register({
          app_version: APP_VERSION
        })
      }
    })
  }, [])

  if (!posthogKey || !isPosthogEnabled) return <>{children}</>

  return (
    <Suspense fallback={<>{children}</>}>
      <PostHogProvider client={posthog}>
        <AnalyticsProviderInner>{children}</AnalyticsProviderInner>
      </PostHogProvider>
    </Suspense>
  )
}
