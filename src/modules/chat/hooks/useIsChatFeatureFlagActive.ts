import { POSTHOG_FLAGS } from '@/modules/analytics/posthog-flags'
import { useFeatureFlagEnabled } from 'posthog-js/react'

export function useIsChatFeatureFlagActive() {
  return useFeatureFlagEnabled(POSTHOG_FLAGS.showLiveSupportChat)
}
