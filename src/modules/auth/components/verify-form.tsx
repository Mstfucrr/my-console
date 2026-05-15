'use client'
import { OtpCodeInput } from '@/components/form/OtpCodeInput'
import { Badge } from '@/components/ui/badge'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCcw } from 'lucide-react'
import { useAuth } from '../context/auth-context'

const OTP_TIMEOUT = 60

export function VerifyForm() {
  const {
    otpState,
    loadingState,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleVerifyOtp,
    handleResendOtp,
    otpInputRefs,
    backToLoginForm
  } = useAuth()

  const isTimerComplete = otpState.timer === 0

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <p className='text-sm text-gray-600'>{otpState.maskedPhoneNumber} numarasına gelen 6 haneli kodu giriniz.</p>
      </div>

      <form className='space-y-4'>
        <OtpCodeInput
          values={otpState.values}
          inputRefs={otpInputRefs}
          onChange={handleOtpChange}
          onPaste={handleOtpPaste}
          onKeyDown={handleOtpKeyDown}
          disabled={isTimerComplete || loadingState.verify || loadingState.resend}
        />
        <div className='mt-6'>
          <div className='relative z-1'>
            <motion.div
              className='bg-primary absolute z-[-1] h-full w-full rounded-xl'
              initial={{ width: '100%' }}
              animate={{
                width: loadingState.verify ? '100%' : `${(otpState.timer / OTP_TIMEOUT) * 100}%`
              }}
              transition={{ duration: 1 }}
            />
            {!isTimerComplete || loadingState.verify ? (
              <LoadingButton
                type='button'
                variant='outline'
                className='w-full bg-transparent! text-white'
                size='md'
                onClick={handleVerifyOtp}
                disabled={!otpState.isComplete}
                isLoading={loadingState.verify}
                loadingText='Doğrulanıyor...'
              >
                <Badge className='pr-0 text-lg'>
                  <span className={cn('flex items-center gap-2', { 'text-gray-100': !otpState.isComplete })}>
                    Doğrula <small className='text-xs'>({otpState.timer})</small>
                  </span>
                </Badge>
              </LoadingButton>
            ) : (
              <LoadingButton
                type='button'
                className='w-full'
                size='md'
                onClick={handleResendOtp}
                isLoading={loadingState.resend}
                loadingText='Tekrar Gönderiliyor...'
              >
                <RefreshCcw className='mr-2 size-4' />
                <span className='text-white'>Tekrar Gönder</span>
              </LoadingButton>
            )}
          </div>
        </div>
        <div className='text-center'>
          <button
            type='button'
            onClick={backToLoginForm}
            className='text-primary flex w-fit items-center justify-center gap-1 justify-self-center text-sm hover:underline'
          >
            <ArrowLeft className='h-4 w-4' />
            Geri Dön
          </button>
        </div>
      </form>
    </div>
  )
}
