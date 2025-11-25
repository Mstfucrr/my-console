import { Turnstile } from 'next-turnstile'

export function AuthTurnstile() {
  return <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY} theme='light' />
}
