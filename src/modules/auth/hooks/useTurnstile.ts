'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type TurnstileStatus = 'success' | 'error' | 'expired' | 'required' | 'loading'

const isDevelopment = process.env.NODE_ENV === 'development'

export function useTurnstile() {
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)

  const handleSuccess = useCallback((newToken: string) => {
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

  useEffect(() => {
    console.log('turnstileStatus', turnstileStatus)
  }, [turnstileStatus])

  const isValid = useMemo(() => {
    if (isDevelopment || turnstileStatus === undefined || turnstileStatus === 'loading') return true
    return turnstileStatus === 'success' && token !== null
  }, [turnstileStatus, token])

  const errorMessage = useMemo(() => {
    if (isDevelopment || turnstileStatus === undefined || turnstileStatus === 'loading') return null
    if (turnstileStatus === 'error') return 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyiniz.'
    if (turnstileStatus === 'expired') return 'Güvenlik doğrulaması süresi doldu. Lütfen tekrar deneyiniz.'
    if (turnstileStatus === 'required') return 'Lütfen güvenlik doğrulamasını tamamlayınız.'
    return null
  }, [turnstileStatus])

  return {
    token,
    turnstileStatus,
    isValid,
    errorMessage,
    handlers: {
      onSuccess: handleSuccess,
      onError: handleError,
      onExpire: handleExpire,
      onLoad: handleLoad
    },
    resetToken
  }
}
