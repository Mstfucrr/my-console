'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { useAuthContext } from '@/modules/auth/context/AuthContext'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

const VerfiyForm = () => {
  // const { loginData } = useAuthContext()
  const loginData = {
    otpTimeout: 55,
    phoneNumber: '1234567890',
    installationId: '1234567890'
  }
  const { verifyOtpMutation, setCookieMutation } = useAuthContext()
  const totalOtpField = 6
  const otpArray: string[] = Array.from({ length: totalOtpField }, () => '')
  const [otp, setOtp] = useState<string[]>(otpArray)
  const otpFields = Array.from({ length: totalOtpField }, (_, index) => index)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [timer, setTimer] = useState(loginData.otpTimeout)

  const { mutateAsync: verifyOtp, isPending: isVerifyOtpPending } = verifyOtpMutation

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === 0) return
      setTimer(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const isTimerComplete = useMemo(() => timer === 0, [timer])

  useEffect(() => {
    if (isTimerComplete) {
      setOtp(otpArray)
    }
  }, [isTimerComplete, otpArray])

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value.length === 1 && index < totalOtpField - 1) {
        inputRefs.current[index + 1]?.focus()
      }
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

  const handleSubmit = async () => {
    if (!loginData || loginData.otpTimeout === 0) return
    const enteredOtp = otp.join('')
    setOtp(otpArray)
    inputRefs.current[0]?.focus()
    if (!loginData.installationId) return

    const { action_cookie, isOtpValid } = await verifyOtp({
      installationId: loginData.installationId,
      otp: enteredOtp,
      phoneNumber: loginData.phoneNumber
    })

    if (!isOtpValid) {
      toast.error('Kod geçersiz. Lütfen tekrar deneyiniz.')
      return
    }

    await setCookieMutation.mutateAsync({
      action_cookie
    })

    router.push('/')
  }

  const handleResendOtp = () => {
    setTimer(loginData.otpTimeout)
  }

  const isOtpComplete = otp.every(digit => digit !== '')
  const maskedPhoneNumber = `**** *** ${loginData.phoneNumber.slice(-4)}`

  return (
    <div className='mx-auto w-auto p-2 md:p-6'>
      <p className='text-center text-lg font-semibold text-gray-800'>{maskedPhoneNumber}</p>
      <p className='mt-1 text-center text-sm text-gray-600'>Numarasına gelen 6 haneli kodu giriniz.</p>
      <form className='mt-6'>
        <div className='flex justify-center gap-3'>
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
              maxLength={1}
              className='size-12 rounded border-gray-300 text-center text-2xl font-semibold text-gray-900 max-sm:size-10'
              ref={ref => {
                if (ref) {
                  inputRefs.current[index] = ref
                }
              }}
            />
          ))}
        </div>
        <div className='mt-6'>
          <div className='relative z-1'>
            <motion.div
              className='bg-primary absolute z-[-1] h-full w-full rounded-l-md'
              initial={{ width: '100%' }}
              animate={{ width: isVerifyOtpPending ? '100%' : `${(timer / loginData.otpTimeout) * 100}%` }}
              transition={{ duration: 1 }}
            />
            {!isTimerComplete ? (
              <LoadingButton
                type='button'
                variant='outline'
                className='w-full !bg-transparent text-white'
                size='lg'
                onClick={handleSubmit}
                disabled={!isOtpComplete}
                isLoading={isVerifyOtpPending}
                loadingText='Doğrulanıyor...'
              >
                <Badge className='text-lg'>
                  <span className={cn({ 'text-gray-100': !isOtpComplete })}>Verify Now</span>
                </Badge>
              </LoadingButton>
            ) : (
              <Button type='button' className='w-full' size='lg' onClick={handleResendOtp}>
                <span className='text-white'>Tekrar Gönder</span>
              </Button>
            )}
          </div>
        </div>
      </form>
      <p className='mt-4 text-center text-sm text-gray-500'>
        {isTimerComplete ? 'Zaman doldu. Lütfen tekrar deneyiniz.' : `${timer} saniye içinde giriş yapınız.`}
      </p>
    </div>
  )
}

export default VerfiyForm
