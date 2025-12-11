'use client'

import { Turnstile } from 'next-turnstile'
import { useTurnstile } from '../hooks/useTurnstile'

const isDevelopment = process.env.NODE_ENV === 'development'

const isTurnstileActive = process.env.NEXT_PUBLIC_TURNSTILE_ACTIVE === 'true'

export interface AuthTurnstileProps {
  turnstileState: ReturnType<typeof useTurnstile>
}

export function AuthTurnstile({ turnstileState }: AuthTurnstileProps) {
  const { handlers, errorMessage } = turnstileState

  if (isDevelopment || !isTurnstileActive) return null

  return (
    <div className='flex flex-col'>
      <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY || ''} theme='light' {...handlers} />
      {errorMessage && <p className='text-destructive ml-1 text-xs'>{errorMessage}</p>}
    </div>
  )
}
