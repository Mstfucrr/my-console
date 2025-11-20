'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  type ChangeEvent,
  type KeyboardEvent,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { toast } from 'react-toastify'
import { authService } from '../service/auth.service'
import { IVerifyOtpRequest } from '../types'

const OTP_TIMEOUT = 60

interface VerfiyFormProps {
  otpSessionId: string
  maskedPhoneNumber: string
}

const VerfiyForm = ({ otpSessionId, maskedPhoneNumber }: VerfiyFormProps) => {
  const { mutateAsync: verifyOtp, isPending: isVerifyOtpPending } = useMutation({
    mutationFn: (request: IVerifyOtpRequest) => authService.verifyOtp(request)
  })
  const totalOtpField = 6
  const otpArray: string[] = Array.from({ length: totalOtpField }, () => '')
  const [otp, setOtp] = useState<string[]>(otpArray)
  const otpFields = Array.from({ length: totalOtpField }, (_, index) => index)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const [timer, setTimer] = useState(OTP_TIMEOUT)

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === 0) return
      setTimer(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const isTimerComplete = useMemo(() => timer === 0, [timer])

  const resetOtp = useCallback(() => {
    startTransition(() => setOtp(otpArray))
    setTimeout(() => inputRefs.current[0]?.focus(), 0)
  }, [otpArray])

  useEffect(() => {
    if (!isTimerComplete) return
    resetOtp()
  }, [isTimerComplete, resetOtp])

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const digit = e.target.value.replace(/[^0-9]/g, '').slice(0, 1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    if (digit && index < totalOtpField - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && otp[index] === '' && index > 0) {
      setOtp(prevOtp => {
        const newOtp = [...prevOtp]
        newOtp[index - 1] = ''
        return newOtp
      })
      inputRefs.current[index - 1]?.focus()
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (event.key === 'ArrowRight' && index < totalOtpField - 1) {
      inputRefs.current[index + 1]?.focus()
    } else if (event.key === 'Enter') {
      handleSubmit()
    }
  }

  const router = useRouter()

  async function handleVerifyOtp() {
    const enteredOtp = otp.join('')
    const { userId } = await verifyOtp({
      otpCode: enteredOtp,
      otpSessionId: otpSessionId
    })

    if (!userId) throw new Error('Invalid OTP')
  }

  const handleSubmit = async () => {
    if (!otpSessionId) return
    setOtp(otpArray)

    toast
      .promise(handleVerifyOtp, {
        pending: 'Kod doğrulanıyor...',
        success: 'Başarılıyla giriş yaptınız.',
        error: 'Kod geçersiz. Lütfen tekrar deneyiniz.'
      })
      .then(() => router.push('/'))
      .catch(() => setTimeout(() => inputRefs.current[0]?.focus(), 0))
  }

  const handleResendOtp = () => {
    setTimer(OTP_TIMEOUT)
    resetOtp()
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  return (
    <div className='w-full'>
      <div className='mb-6 text-center'>
        <p className='text-lg font-medium text-gray-800'>{maskedPhoneNumber}</p>
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
              value={otp[index]}
              onChange={e => handleChange(e, index)}
              onKeyDown={event => handleKeyDown(index, event)}
              disabled={isTimerComplete || isVerifyOtpPending}
              autoFocus={index === 0}
              maxLength={1}
              className='focus:border-primary no-spin h-12 w-12 rounded-lg border-2 text-center text-xl font-semibold'
              ref={(ref: HTMLInputElement | null) => {
                inputRefs.current[index] = ref
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
                width: isVerifyOtpPending ? '100%' : `${(timer / OTP_TIMEOUT) * 100}%`
              }}
              transition={{ duration: 1 }}
            />
            {!isTimerComplete || isVerifyOtpPending ? (
              <LoadingButton
                type='button'
                variant='outline'
                className='w-full bg-transparent! text-white'
                size='lg'
                onClick={handleSubmit}
                disabled={!isOtpComplete}
                isLoading={isVerifyOtpPending}
                loadingText='Doğrulanıyor...'
              >
                <Badge className='text-lg'>
                  <span className={cn('flex items-center gap-2', { 'text-gray-100': !isOtpComplete })}>
                    Gönder <small className='text-xs'>({timer})</small>
                  </span>
                </Badge>
              </LoadingButton>
            ) : (
              <Button type='button' className='w-full' size='lg' onClick={handleResendOtp}>
                <RefreshCcw className='mr-2 size-4' />
                <span className='text-white'>Tekrar Gönder</span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default VerfiyForm
