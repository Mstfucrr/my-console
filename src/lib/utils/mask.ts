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

export function maskLastName(fullName: string): string {
  if (!fullName) return fullName
  // son kelimeyi maskle
  const lastWord = fullName.split(' ').pop()
  if (!lastWord) return fullName
  const maskedLastWord = maskString(lastWord, {
    visibleStart: 1,
    visibleEnd: 1,
    maskChar: '*',
    preserveNonDigits: false
  })
  return `${fullName.split(' ').slice(0, -1).join(' ')} ${maskedLastWord}`
}

export function maskAddress(address: string) {
  // Show only first 8 chars, mask the rest except last 4
  if (!address) return ''
  if (address.length <= 12) return address[0] + '*'.repeat(address.length - 2) + address[address.length - 1]
  return `${address.slice(0, 8)}${'*'.repeat(6)}`
}

/** VKN (10 hane) — ilk 2 ve son 2 rakam görünür */
export function maskTaxNumber(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length <= 4) return '*'.repeat(digits.length)
  return maskString(digits, { visibleStart: 2, visibleEnd: 2, maskChar: '*', preserveNonDigits: false })
}

/** TCKN (11 hane) — ilk 1 ve son 2 rakam görünür */
export function maskIdentityNumber(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length <= 3) return '*'.repeat(digits.length)
  return maskString(digits, { visibleStart: 1, visibleEnd: 2, maskChar: '*', preserveNonDigits: false })
}

/** IBAN — ülke kodu + kontrol + banka önü ve hesap sonu kısmen görünür (örn. TR + ilk 4 + son 4) */
export function maskIban(value: string): string {
  const normalized = value.replace(/\s/g, '').toUpperCase()
  if (!normalized) return ''
  const totalVisible = 10
  if (normalized.length <= totalVisible) {
    return maskString(normalized, { visibleStart: 2, visibleEnd: Math.min(2, normalized.length - 2) })
  }
  return maskString(normalized, { visibleStart: 6, visibleEnd: 4, maskChar: '*', preserveNonDigits: false })
}
