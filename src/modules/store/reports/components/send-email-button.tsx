import { TooltippedElement } from '@/components/tooltipped-element'
import { LoadingButton } from '@/components/ui/loading-button'
import { MailIcon, SendHorizonalIcon } from 'lucide-react'

export function SendEmailButton({
  sendEmail,
  isSending,
  hasData
}: {
  sendEmail: () => void
  isSending: boolean
  hasData: boolean
}) {
  if (!hasData) return null

  return (
    <TooltippedElement tooltipContent='E-posta olarak gönder'>
      <LoadingButton
        variant='soft'
        color='success'
        className='relative'
        size='icon-sm'
        aria-label='Raporları e-posta olarak gönder'
        onClick={sendEmail}
        isLoading={isSending}
        showContentWhenLoading={false}
      >
        <MailIcon className='absolute top-0.5 left-1 size-4.5' />
        <SendHorizonalIcon className='absolute right-0.5 bottom-0.5 size-3.5' />
      </LoadingButton>
    </TooltippedElement>
  )
}
