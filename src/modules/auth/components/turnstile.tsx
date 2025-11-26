'use client'

import { Turnstile } from 'next-turnstile'
import { useMemo } from 'react'
import { useTurnstile } from '../hooks/useTurnstile'

export interface AuthTurnstileProps {
  turnstileState: ReturnType<typeof useTurnstile>
}

export function AuthTurnstile({ turnstileState }: AuthTurnstileProps) {
  const { handlers, turnstileStatus } = turnstileState
  const { onSuccess, onError, onExpire } = handlers

  const errorMessage = useMemo(() => {
    if (turnstileStatus === 'error') return 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyiniz.'
    if (turnstileStatus === 'expired') return 'Güvenlik doğrulaması süresi doldu. Lütfen tekrar deneyiniz.'
    return null
  }, [turnstileStatus])

  return (
    <div className='flex flex-col'>
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY || ''}
        theme='light'
        onVerify={onSuccess}
        onError={onError}
        onExpire={onExpire}
      />
      {errorMessage && <p className='text-destructive ml-1 text-xs'>{errorMessage}</p>}
    </div>
  )
}
