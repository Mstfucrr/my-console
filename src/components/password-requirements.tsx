'use client'

import { cn } from '@/lib/utils'

/** Şifre validasyon kuralları — reset-password ve SetPasswordView ile ortak kullanım */
export const PASSWORD_REGEXES = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /\d/,
  special: /[!@#$%^&*()]/
} as const

const REQUIREMENTS: { key: keyof typeof PASSWORD_REGEXES | 'length'; label: string }[] = [
  { key: 'length', label: 'En az 8 karakter' },
  { key: 'uppercase', label: 'En az bir büyük harf (A-Z)' },
  { key: 'lowercase', label: 'En az bir küçük harf (a-z)' },
  { key: 'number', label: 'En az bir rakam (0-9)' },
  { key: 'special', label: 'En az bir özel karakter (!@#$%^&*())' }
]

function getRequirementStatus(password: string): Record<string, boolean> {
  return {
    length: password.length >= 8,
    uppercase: PASSWORD_REGEXES.uppercase.test(password),
    lowercase: PASSWORD_REGEXES.lowercase.test(password),
    number: PASSWORD_REGEXES.number.test(password),
    special: PASSWORD_REGEXES.special.test(password)
  }
}

export function PasswordRequirements({
  password,
  includeSpecialCharacters = false
}: {
  password: string
  includeSpecialCharacters?: boolean
}) {
  const requirements = includeSpecialCharacters ? REQUIREMENTS : REQUIREMENTS.filter(r => r.key !== 'special')
  const status = getRequirementStatus(password)
  const isValid = requirements.every(r => status[r.key])

  return (
    <div className={cn('rounded-lg p-3 shadow-sm', isValid ? 'bg-green-50' : 'bg-blue-50')}>
      <p className='text-xs'>
        <strong className={cn(isValid ? 'text-green-700' : 'text-primary')}>Şifre gereksinimleri:</strong>
        <br />
        {requirements.map(({ key, label }) => (
          <span key={key} className={status[key] ? 'text-green-700' : 'text-primary'}>
            {status[key] ? '✔' : '•'} {label}
            <br />
          </span>
        ))}
      </p>
    </div>
  )
}
