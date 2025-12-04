'use client'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { RefreshCcw } from 'lucide-react'
import { useAuth } from '../context/auth-context'

const TOTAL_OTP_FIELD = 6
const OTP_TIMEOUT = 60

export function VerifyForm() {
  const { otpState, loadingState, handleOtpChange, handleOtpKeyDown, handleVerifyOtp, handleResendOtp, otpInputRefs } =
    useAuth()

  const isTimerComplete = otpState.timer === 0

  const otpFields = Array.from({ length: TOTAL_OTP_FIELD }, (_, index) => index)

  return (
    <div className='w-full'>
      <div className='mb-6 text-center'>
        <p className='text-lg font-medium text-gray-800'>{otpState.maskedPhoneNumber}</p>
        <p className='mt-1 text-sm text-gray-600'>Numarasına gelen 6 haneli kodu giriniz.</p>
      </div>

      <form className='space-y-6'>
        <div className='flex justify-center gap-2'>
          {otpFields.map(index => (
            <Input
              key={`otp-code-${index}`}
              type='text'
              id={`otp${index}`}
              name={`otp${index}`}
              value={otpState.values[index]}
              onChange={e => handleOtpChange(index, e.target.value)}
              onKeyDown={event => handleOtpKeyDown(index, event)}
              disabled={isTimerComplete || loadingState.verify || loadingState.resend}
              autoFocus={index === 0}
              maxLength={1}
              className='focus:border-primary no-spin max-xs:size-10 size-12 rounded-lg border-2 text-center text-xl font-semibold'
              ref={(ref: HTMLInputElement | null) => {
                otpInputRefs.current[index] = ref
              }}
              inputMode='numeric'
              pattern='[0-9]*'
            />
          ))}
        </div>
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
                size='lg'
                onClick={handleVerifyOtp}
                disabled={!otpState.isComplete}
                isLoading={loadingState.verify}
                loadingText='Doğrulanıyor...'
              >
                <Badge className='text-lg'>
                  <span className={cn('flex items-center gap-2', { 'text-gray-100': !otpState.isComplete })}>
                    Gönder <small className='text-xs'>({otpState.timer})</small>
                  </span>
                </Badge>
              </LoadingButton>
            ) : (
              <LoadingButton
                type='button'
                className='w-full'
                size='lg'
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
      </form>
    </div>
  )
}
