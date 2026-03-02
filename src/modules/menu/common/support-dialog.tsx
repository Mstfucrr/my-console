'use client'

import { SupportMessageCircle } from '@/components/svg'
import { TooltippedElement } from '@/components/tooltipped-element'
import { ButtonProps } from '@/components/ui/button'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { LoadingButton } from '@/components/ui/loading-button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useProfile } from '@/context/ProfileProvider'
import { cn } from '@/lib/utils'
import { useGetChatTokenQuery, useInvalidateChatTokenMutation } from '@/modules/chat/hooks/useChatService'
import { useIsChatFeatureFlagActive } from '@/modules/chat/hooks/useIsChatFeatureFlagActive'
import { Order } from '@/types'
import { Loader2, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'

const ChatLoading = () => {
  const showLiveSupportChatFlag = useIsChatFeatureFlagActive()
  if (!showLiveSupportChatFlag) return null
  return (
    <div className='flex items-center justify-center gap-2 p-4'>
      <Loader2 className='size-4 animate-spin' />
      <span className='text-sm'>Chat hazırlanıyor...</span>
    </div>
  )
}

const SupportDialogChat = dynamic(() => import('./support-dialog-chat').then(m => m.SupportDialogChat), {
  ssr: false,
  loading: () => <ChatLoading />
})

export function SupportDialog({
  order,
  onOpenStateChange,
  showText = false,
  contentClassName,
  ...props
}: React.ComponentProps<typeof LoadingButton> & {
  order?: Order
  onOpenStateChange?: (open: boolean) => void
  showText?: boolean
  contentClassName?: string
}) {
  const showLiveSupportChatFlag = useIsChatFeatureFlagActive()
  const activeTokenRef = useRef<string | null>(null)
  const [open, setOpen] = useState(false)
  const { mutate: invalidateChatToken } = useInvalidateChatTokenMutation()
  const { profile } = useProfile()

  const invalidateActiveToken = useCallback(() => {
    const token = activeTokenRef.current
    if (!token) return
    // Aynı token için close/unmount/rotate tetiklenirse tekrar invalidate etmesin.
    activeTokenRef.current = null
    invalidateChatToken(token)
  }, [invalidateChatToken])

  const { isFetching, data } = useGetChatTokenQuery(
    {
      orderId: order?.orderId,
      hubId: profile?.info?.hubId
    },
    {
      enabled: open && !!showLiveSupportChatFlag,
      gcTime: 0,
      staleTime: 0
    }
  )

  // Token değiştiğinde (order/hub değişimi vs) eski token'ı invalidate etmeye çalış.
  useEffect(() => {
    if (!open || isFetching) return
    const nextToken = data?.token ?? null
    if (!nextToken) return
    if (activeTokenRef.current && activeTokenRef.current !== nextToken) invalidateChatToken(activeTokenRef.current)
    activeTokenRef.current = nextToken
  }, [data?.token, invalidateChatToken, isFetching, open])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && open) invalidateActiveToken()
    setOpen(nextOpen)
    onOpenStateChange?.(nextOpen)
  }

  useEffect(() => {
    onOpenStateChange?.(open && !isFetching)
  }, [open, isFetching, onOpenStateChange])

  useEffect(() => {
    // Component unmount olursa açık token'ı invalidate etmeyi dene.
    return () => invalidateActiveToken()
  }, [invalidateActiveToken])

  return (
    <Popover open={open && !isFetching} modal={showLiveSupportChatFlag} onOpenChange={handleOpenChange}>
      <TooltippedElement tooltipContent='Canlı Destek' hidden={!showLiveSupportChatFlag} className='text-xs'>
        <PopoverTrigger asChild>
          <LoadingButton
            isLoading={isFetching}
            size='icon'
            title='Canlı Destek'
            showContentWhenLoading={showText}
            data-testid='support-dialog-button'
            {...props}
            className={cn('relative p-2', props?.className)}
          >
            <SupportMessageCircle className='size-full max-w-7 text-white' />
            {showText && 'Canlı Destek'}
          </LoadingButton>
        </PopoverTrigger>
      </TooltippedElement>

      <PopoverContent
        onPointerDownOutside={e => (showLiveSupportChatFlag ? e.preventDefault() : undefined)}
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
        className={cn(
          'relative left-1/2! h-[500px] max-h-max min-h-[400px] w-80 -translate-x-1/2! border-0! bg-transparent p-0 shadow-none',
          contentClassName
        )}
      >
        {open && showLiveSupportChatFlag && (
          <TooltippedElement tooltipContent='Kapat' className='text-xs'>
            <ConfirmButton
              className='absolute -top-1 -left-1'
              size='icon-xs'
              color='primary'
              data-testid='support-dialog-close-button'
              confirmationMessage='Destek İletişimini kapatmak istediğinize emin misiniz?'
              confirmButtonMessage='Kapat'
              confirmButtonColor='destructive'
              confirmButtonProps={{ 'data-testid': 'support-dialog-close-confirm' } as ButtonProps}
              cancelButtonMessage='İptal'
              cancelButtonColor='secondary'
              onConfirm={() => handleOpenChange(false)}
            >
              <X className='size-full' />
            </ConfirmButton>
          </TooltippedElement>
        )}

        <SupportDialogChat token={data?.token ?? ''} order={order} />
      </PopoverContent>
    </Popover>
  )
}
