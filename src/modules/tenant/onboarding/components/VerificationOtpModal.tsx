'use client'

import { OtpCodeInput } from '@/components/form/OtpCodeInput'
import { Dialog, DialogContent, DialogContentInner, DialogFooter } from '@/components/ui/dialog'
import { LoadingButton } from '@/components/ui/loading-button'
import { Timer } from 'lucide-react'

type VerificationType = 'phone' | 'email'

type VerificationOtpModalProps = {
  open: boolean
  type: VerificationType
  value: string
  otpValues: string[]
  otpInputRefs: React.RefObject<Array<HTMLInputElement | null>>
  isVerifying: boolean
  isSending: boolean
  remainingSeconds: number
  onOpenChange: (open: boolean) => void
  onOtpChange: (index: number, value: string) => void
  onOtpPaste: (index: number, value: string) => void
  onOtpKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void
  onVerify: () => void
  onResend: () => void
}

export function VerificationOtpModal({
  open,
  type,
  value,
  otpValues,
  otpInputRefs,
  isVerifying,
  isSending,
  remainingSeconds,
  onOpenChange,
  onOtpChange,
  onOtpPaste,
  onOtpKeyDown,
  onVerify,
  onResend
}: VerificationOtpModalProps) {
  const isComplete = otpValues.every(Boolean)
  const isExpired = remainingSeconds <= 0
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const label = type === 'phone' ? 'Telefon Numarası' : 'E-Posta'
  const description =
    type === 'phone'
      ? `Başvuruya devam edebilmek için ${value} numaranıza gönderilen 6 haneli kodu girerek telefon numaranızı doğrulayınız.`
      : `Başvuruya devam edebilmek için ${value} adresinize gönderilen 6 haneli kodu girerek e-posta adresinizi doğrulayınız.`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size='md' onOpenAutoFocus={event => event.preventDefault()}>
        <DialogContentInner className='sm:p-5'>
          <div className='flex flex-col gap-5 p-4 pb-0'>
            <div className='flex flex-col gap-2'>
              <h3 className='text-lg font-semibold'>{label} Doğrulama</h3>
              <p className='text-muted-foreground text-sm'>{description}</p>
            </div>

            <OtpCodeInput
              values={otpValues}
              inputRefs={otpInputRefs}
              onChange={onOtpChange}
              onPaste={onOtpPaste}
              onKeyDown={onOtpKeyDown}
              disabled={isVerifying || isSending || isExpired}
            />

            <div className='flex justify-between gap-2'>
              <div className='flex w-full items-center justify-center gap-2'>
                <Timer className='text-primary size-4' />
                <p className='text-muted-foreground text-sm'>
                  {isExpired ? 'Tekrar gönderebilirsiniz' : `Tekrar gönder: ${formattedTime}`}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <LoadingButton
              type='button'
              size='md'
              className='w-full'
              onClick={isExpired ? onResend : onVerify}
              isLoading={isVerifying}
              loadingText={isExpired ? 'Gönderiliyor...' : 'Doğrulanıyor...'}
              disabled={(!isExpired && !isComplete) || isVerifying || isSending}
            >
              {isExpired ? 'Tekrar Gönder' : 'Doğrula'}
            </LoadingButton>
          </DialogFooter>
        </DialogContentInner>
      </DialogContent>
    </Dialog>
  )
}
