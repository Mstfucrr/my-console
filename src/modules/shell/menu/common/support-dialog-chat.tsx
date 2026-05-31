'use client'

import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileProvider'
import { useAlotechWidget } from '@/modules/shell/chat/hooks/useAlotechWidget'
import { useIsChatFeatureFlagActive } from '@/modules/shell/chat/hooks/useIsChatFeatureFlagActive'
import { Order } from '@/types'
import { Loader2 } from 'lucide-react'
import { SupportDialogContact } from './support-dialog-contact'

interface AloTechChatWidgetProps {
  token: string
  order?: Order
}

function SupportDialogChatInner({ token, order }: AloTechChatWidgetProps) {
  const { isAuthenticated } = useAuth()
  const { profile } = useProfile()

  const enabled = isAuthenticated && Boolean(profile)

  const { containerRef, isReady, hasError } = useAlotechWidget({
    enabled,
    token,
    order
  })

  if (!enabled || !token || hasError) return <SupportDialogContact />

  return (
    <div className='h-full w-full overflow-hidden rounded-xl bg-white shadow-xl'>
      {!isReady && (
        <div className='text-primary flex h-full flex-col items-center justify-center gap-2 p-4 text-sm'>
          <Loader2 className='size-5 animate-spin' />
          <span>Chat hazırlanıyor...</span>
        </div>
      )}
      <div ref={containerRef} className='h-full w-full' />
    </div>
  )
}

export function SupportDialogChat({ token, order }: AloTechChatWidgetProps) {
  const showLiveSupportChatFlag = useIsChatFeatureFlagActive()
  if (!showLiveSupportChatFlag) return <SupportDialogContact chatFeatureFlagDisabled />
  return <SupportDialogChatInner token={token} order={order} />
}
