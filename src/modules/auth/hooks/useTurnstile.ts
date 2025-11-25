'use client'

import { useCallback, useState } from 'react'

type TurnstileStatus = 'success' | 'error' | 'expired' | 'required'

/**
 * Hook for managing Turnstile token state
 * Provides token state and handlers for success, error, and expire events
 *
 * @returns Object containing token, handlers, and reset function
 *
 * @example
 * ```tsx
 * const { token, handlers, resetToken } = useTurnstile()
 *
 * return (
 *   <>
 *     <AuthTurnstile {...handlers} />
 *     <button onClick={() => submit({ turnstileToken: token })}>Submit</button>
 *   </>
 * )
 * ```
 */
export function useTurnstile() {
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>('required')
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

  return {
    token,
    turnstileStatus,
    handlers: {
      onSuccess: handleSuccess,
      onError: handleError,
      onExpire: handleExpire
    },
    resetToken
  }
}
