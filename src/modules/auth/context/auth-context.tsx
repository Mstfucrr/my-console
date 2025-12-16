'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { authService } from '../service/auth.service'
import { ILoginRequest, IVerifyOtpRequest } from '../types'

const OTP_TIMEOUT = 60
const TOTAL_OTP_FIELD = 6

// Create empty OTP array outside component to avoid recreation on every render
const createEmptyOtpArray = () => Array.from({ length: TOTAL_OTP_FIELD }, () => '')

type OtpState = {
  values: string[]
  timer: number
  isComplete: boolean
  requiresOtp: boolean
  sessionId: string
  maskedPhoneNumber: string
}

const defaultOtpState: OtpState = {
  values: createEmptyOtpArray(),
  timer: OTP_TIMEOUT,
  isComplete: false,
  requiresOtp: false,
  sessionId: '',
  maskedPhoneNumber: ''
}

type LoadingState = {
  login: boolean
  verify: boolean
  resend: boolean
}

type AuthContextType = {
  // Grouped states
  otpState: OtpState
  loadingState: LoadingState

  // Computed
  isOtp: boolean

  // Login actions
  handleLogin: (data: ILoginRequest) => Promise<void>

  // OTP actions
  handleOtpChange: (index: number, value: string) => void
  handleOtpKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void
  handleOtpPaste: (index: number, value: string) => void
  handleVerifyOtp: () => Promise<void>
  handleResendOtp: () => Promise<void>
  resetOtp: () => void
  backToLoginForm: () => void

  // Refs for OTP inputs
  otpInputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  // OTP state grouped
  const [otpState, setOtpState] = useState<OtpState>(defaultOtpState)

  // Login request for resend
  const [loginRequest, setLoginRequest] = useState<ILoginRequest | null>(null)
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([])
  const hasResetOnTimerComplete = useRef(false)

  // Mutations
  const { mutateAsync: login, isPending: isLoginPending } = useMutation({
    mutationFn: (request: ILoginRequest) => authService.login(request)
  })

  const { mutateAsync: verifyOtp, isPending: isVerifyOtpPending } = useMutation({
    mutationFn: (request: IVerifyOtpRequest) => authService.verifyOtp(request)
  })

  // Loading state grouped
  const loadingState: LoadingState = useMemo(
    () => ({
      login: isLoginPending,
      verify: isVerifyOtpPending,
      resend: isLoginPending && Boolean(loginRequest)
    }),
    [isLoginPending, isVerifyOtpPending, loginRequest]
  )

  // Timer logic
  useEffect(() => {
    if (!otpState.sessionId) return
    const interval = setInterval(() => {
      setOtpState(prev => {
        if (prev.timer === 0) return prev
        return {
          ...prev,
          timer: prev.timer - 1
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [otpState.sessionId])

  // Update isComplete when OTP values change
  const isOtpComplete = useMemo(() => otpState.values.every(digit => digit !== ''), [otpState.values])

  // Update otpState with computed isComplete
  const otpStateWithComplete = useMemo(() => ({ ...otpState, isComplete: isOtpComplete }), [otpState, isOtpComplete])

  // Computed values
  const isOtp = Boolean(otpState.sessionId && otpState.requiresOtp)

  // Reset OTP when timer completes
  const resetOtp = useCallback(() => {
    setOtpState(prev => ({
      ...prev,
      values: createEmptyOtpArray()
    }))
    setTimeout(() => otpInputRefs.current[0]?.focus(), 0)
  }, [])

  const backToLoginForm = useCallback(() => setOtpState(defaultOtpState), [])

  useEffect(() => {
    if (otpState.timer !== 0 || !otpState.sessionId || hasResetOnTimerComplete.current) return
    hasResetOnTimerComplete.current = true
    startTransition(() => resetOtp())
  }, [otpState.timer, otpState.sessionId, resetOtp])

  // Login handler
  const handleLogin = async (data: ILoginRequest) => {
    try {
      const loginResponse = await login(data)

      if (loginResponse.requiresOtp && loginResponse.otpSessionId) {
        hasResetOnTimerComplete.current = false
        setOtpState({
          values: createEmptyOtpArray(),
          timer: OTP_TIMEOUT,
          isComplete: false,
          sessionId: loginResponse.otpSessionId,
          maskedPhoneNumber: loginResponse.maskedPhoneNumber ?? '',
          requiresOtp: loginResponse.requiresOtp ?? false
        })
        setLoginRequest(data)
      } else {
        toast.success('Başarılıyla giriş yaptınız.')
        router.push('/')
      }
    } catch (error) {
      console.error('login error', error)
      toast.error('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyiniz.')
      throw error
    }
  }

  // Verify OTP handler
  const handleVerifyOtp = useCallback(async () => {
    if (!otpState.sessionId) return

    const enteredOtp = otpState.values.join('')
    setOtpState(prev => ({ ...prev, values: createEmptyOtpArray() }))

    try {
      await toast.promise(
        async () => {
          const { userId } = await verifyOtp({
            otpCode: enteredOtp,
            otpSessionId: otpState.sessionId
          })

          if (!userId) throw new Error('Invalid OTP')
        },
        {
          pending: 'Kod doğrulanıyor...',
          success: 'Başarılıyla giriş yaptınız.',
          error: 'Kod geçersiz. Lütfen tekrar deneyiniz.'
        }
      )

      router.push('/')
    } catch {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 0)
    }
  }, [otpState.sessionId, otpState.values, verifyOtp, router, otpInputRefs])

  // OTP change handler
  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/[^0-9]/g, '').slice(0, 1)
      setOtpState(prev => {
        const newValues = [...prev.values]
        newValues[index] = digit
        return { ...prev, values: newValues }
      })

      if (digit && index < TOTAL_OTP_FIELD - 1) {
        otpInputRefs.current[index + 1]?.focus()
      }
    },
    [otpInputRefs]
  )

  // OTP key down handler
  const handleOtpKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace' && otpState.values[index] === '' && index > 0) {
        setOtpState(prev => {
          const newValues = [...prev.values]
          newValues[index - 1] = ''
          return { ...prev, values: newValues }
        })
        otpInputRefs.current[index - 1]?.focus()
      } else if (event.key === 'ArrowLeft' && index > 0) {
        otpInputRefs.current[index - 1]?.focus()
      } else if (event.key === 'ArrowRight' && index < TOTAL_OTP_FIELD - 1) {
        otpInputRefs.current[index + 1]?.focus()
      } else if (event.key === 'Enter') {
        handleVerifyOtp()
      }
    },
    [otpState.values, handleVerifyOtp, otpInputRefs]
  )

  // OTP paste handler
  const handleOtpPaste = useCallback(
    (index: number, value: string) => {
      const cleanedValue = value.replace(/\D/g, '')
      for (let i = 0; i < cleanedValue.length; i++) {
        handleOtpChange(index + i, cleanedValue[i])
      }
    },
    [handleOtpChange]
  )

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!loginRequest) return

    try {
      const loginResponse = await login({ ...loginRequest, turnstileToken: undefined })

      if (loginResponse.requiresOtp && loginResponse.otpSessionId) {
        hasResetOnTimerComplete.current = false
        setOtpState(prev => ({
          ...prev,
          timer: OTP_TIMEOUT,
          sessionId: loginResponse.otpSessionId!,
          maskedPhoneNumber: loginResponse.maskedPhoneNumber ?? ''
        }))
        resetOtp()
        toast.success('Yeni kod gönderildi.')
      }
    } catch (error) {
      console.error('resend otp error', error)
      toast.error('Kod gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        otpState: otpStateWithComplete,
        loadingState,
        isOtp,
        handleLogin,
        handleOtpChange,
        handleOtpKeyDown,
        handleOtpPaste,
        handleVerifyOtp,
        handleResendOtp,
        resetOtp,
        backToLoginForm,
        otpInputRefs
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
