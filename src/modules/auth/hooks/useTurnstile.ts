'use client'

import { useCallback, useMemo, useState } from 'react'

type TurnstileStatus = 'success' | 'error' | 'expired' | 'required' | 'loading'

const isDevelopment = process.env.NODE_ENV === 'development'

export function useTurnstile() {
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)

  const handleVerify = useCallback((newToken: string) => {
    setToken(newToken)
    setTurnstileStatus('success')
  }, [])

  const handleError = useCallback(() => {
    setToken(null)
    setTurnstileStatus('error')
  }, [])

  const handleExpire = useCallback(() => {
    setToken(null)
    setTurnstileStatus('expired')
  }, [])

  const resetToken = useCallback(() => {
    setToken(null)
    setTurnstileStatus('required')
  }, [])

  const handleLoad = useCallback(() => {
    setTurnstileStatus('loading')
  }, [])

  const isValid = useMemo(() => {
    if (isDevelopment || turnstileStatus === undefined || turnstileStatus === 'loading') return true
    return turnstileStatus === 'success' && token !== null
  }, [turnstileStatus, token])

  const errorMessage = useMemo(() => {
    if (isDevelopment || turnstileStatus === undefined || turnstileStatus === 'loading') return null
    else if (turnstileStatus === 'error') return 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyiniz.'
    else return null
  }, [turnstileStatus])

  return {
    token,
    turnstileStatus,
    isValid,
    errorMessage,
    handlers: {
      onVerify: handleVerify,
      onError: handleError,
      onExpire: handleExpire,
      onLoad: handleLoad
    },
    resetToken
  }
}
