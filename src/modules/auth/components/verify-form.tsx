'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { useAuthContext } from '@/modules/auth/context/AuthContext'
import { motion } from 'framer-motion'
import { RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type ChangeEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

const VerfiyForm = () => {
  // const { loginData } = useAuthContext()
  const loginData = {
    otpTimeout: 30,
    phoneNumber: '1234567890',
    installationId: '1234567890'
  }
  const { verifyOtpMutation, setCookieMutation } = useAuthContext()
  const totalOtpField = 6
  const otpArray: string[] = Array.from({ length: totalOtpField }, () => '')
  const [otp, setOtp] = useState<string[]>(otpArray)
  const otpFields = Array.from({ length: totalOtpField }, (_, index) => index)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const [timer, setTimer] = useState(loginData.otpTimeout)

  const { mutateAsync: verifyOtp, isPending: isVerifyOtpPending } = verifyOtpMutation
  const { mutateAsync: setCookie, isPending: isSetCookiePending } = setCookieMutation

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

  async function verifyOtpAndSetCookie() {
    const enteredOtp = otp.join('')
    const { action_cookie, isOtpValid } = await verifyOtp({
      installationId: loginData.installationId,
      otp: enteredOtp,
      phoneNumber: loginData.phoneNumber
    })

    if (!isOtpValid) {
      toast.error('Kod geçersiz. Lütfen tekrar deneyiniz.')
      return
    }

    await setCookie({
      action_cookie
    })
  }

  const handleSubmit = async () => {
    if (!loginData || loginData.otpTimeout === 0) return
    setOtp(otpArray)
    inputRefs.current[0]?.focus()

    await toast.promise(verifyOtpAndSetCookie, {
      pending: 'Kod doğrulanıyor...',
      success: 'Başarılıyla giriş yaptınız.',
      error: 'Kod geçersiz. Lütfen tekrar deneyiniz.'
    })

    router.push('/')
  }

  const handleResendOtp = () => {
    setTimer(loginData.otpTimeout)
  }

  const isOtpComplete = otp.every(digit => digit !== '')
  const maskedPhoneNumber = `**** *** ${loginData.phoneNumber.slice(-4)}`

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
              disabled={isTimerComplete || isVerifyOtpPending || isSetCookiePending}
              autoFocus={index === 0}
              maxLength={1}
              className='focus:border-primary h-12 w-12 rounded-lg border-2 text-center text-xl font-semibold'
              ref={(ref: HTMLInputElement | null) => {
                inputRefs.current[index] = ref
              }}
            />
          ))}
        </div>
        <div className='mt-6'>
          <div className='relative z-1'>
            <motion.div
              className='bg-primary absolute z-[-1] h-full w-full rounded-xl'
              initial={{ width: '100%' }}
              animate={{
                width: isVerifyOtpPending || isSetCookiePending ? '100%' : `${(timer / loginData.otpTimeout) * 100}%`
              }}
              transition={{ duration: 1 }}
            />
            {!isTimerComplete ? (
              <LoadingButton
                type='button'
                variant='outline'
                className='w-full bg-transparent! text-white'
                size='lg'
                onClick={handleSubmit}
                disabled={!isOtpComplete}
                isLoading={isVerifyOtpPending || isSetCookiePending}
                loadingText='Doğrulanıyor...'
              >
                <Badge className='text-lg'>
                  <span className={cn({ 'text-gray-100': !isOtpComplete })}>Gönder ({timer})</span>
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
