'use client'

import { useFeatureFlagEnabled, usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

import { POSTHOG_FLAGS } from '../posthog-flags'
import { getAnalyticsConsent } from '../utils/analytics-consent'

// Not: posthog-js `useFeatureFlagEnabled()` true/false yanında `undefined` da döndürebilir
// (flag'ler yüklenmeden önce veya flag'ler load olmadan önce).
// Bu hook'ta:
// - flag true => banner gösterilir ve storage'daki consent'e göre opt-in/opt-out yapılır
// - flag false => banner gösterilmez, otomatik opt-in yapılır

export function usePosthogConsentGate() {
  const client = usePostHog()
  const showConsentBannerFlag = useFeatureFlagEnabled(POSTHOG_FLAGS.showConsentBanner)
  const showConsentBanner = showConsentBannerFlag === true
  const consent = getAnalyticsConsent()

  useEffect(() => {
    if (!client) return
    if (showConsentBannerFlag === undefined) return

    if (showConsentBanner) {
      if (consent === 'granted') client.opt_in_capturing()
      if (consent === 'denied') client.opt_out_capturing()
      return
    }

    client.opt_in_capturing()
  }, [client, showConsentBannerFlag, showConsentBanner, consent])

  return {
    showConsentBanner
  }
}
