import { POSTHOG_FLAGS } from '@/modules/shell/analytics/posthog-flags'
import { useFeatureFlagEnabled } from 'posthog-js/react'

const CHAT_ACTIVE = process.env.NEXT_PUBLIC_CHAT_ACTIVE === 'true'

export function useIsChatFeatureFlagActive() {
  return useFeatureFlagEnabled(POSTHOG_FLAGS.showLiveSupportChat) || CHAT_ACTIVE
}
