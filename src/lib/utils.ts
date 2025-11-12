import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generic string masking function
 * @param value - The string to mask
 * @param options - Masking options
 * @param options.visibleStart - Number of characters to show from the start (default: 0)
 * @param options.visibleEnd - Number of characters to show from the end (default: 0)
 * @param options.maskChar - Character to use for masking (default: '*')
 * @param options.preserveNonDigits - If true, preserves non-digit characters in their original positions (default: false)
 * @returns Masked string
 */
export function maskString(
  value: string,
  options: {
    visibleStart?: number
    visibleEnd?: number
    maskChar?: string
    preserveNonDigits?: boolean
  } = {}
): string {
  if (!value) return ''

  const { visibleStart = 0, visibleEnd = 0, maskChar = '*', preserveNonDigits = false } = options

  if (preserveNonDigits) {
    // For phone numbers: preserve formatting characters like +, -, spaces, etc.
    const chars = value.split('')
    const digits = chars.filter(char => /\d/.test(char))
    const totalDigits = digits.length

    if (totalDigits < visibleStart + visibleEnd) {
      return maskChar.repeat(value.length)
    }

    let digitIndex = 0
    return chars
      .map(char => {
        if (/\d/.test(char)) {
          const shouldShow = digitIndex < visibleStart || digitIndex >= totalDigits - visibleEnd
          digitIndex++
          return shouldShow ? char : maskChar
        }
        return char
      })
      .join('')
  } else {
    // Simple masking: just mask the middle part
    const totalVisible = visibleStart + visibleEnd
    if (value.length <= totalVisible) {
      return maskChar.repeat(value.length)
    }

    const start = value.slice(0, visibleStart)
    const end = visibleEnd > 0 ? value.slice(-visibleEnd) : ''
    const middleLength = value.length - visibleStart - visibleEnd
    const middle = maskChar.repeat(middleLength)

    return `${start}${middle}${end}`
  }
}

/**
 * Mask phone number - shows first 3 and last 2 digits
 * @param phone - Phone number string
 * @returns Masked phone number
 */
export function maskPhone(phone: string): string {
  if (!phone) return ''
  return maskString(phone, {
    visibleStart: 3,
    visibleEnd: 2,
    maskChar: '*',
    preserveNonDigits: true
  })
}
