// Saat: SS:DD / SSDD (00-23, 00-59)
export function isValidWorkingHourTime(val: string | null): boolean {
  const d = (val ?? '').replace(/\D/g, '')
  if (d.length !== 4) return false
  const h = +d.slice(0, 2),
    m = +d.slice(2)
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

/**
 * Saat: SS:DD'yi dakikaya çevirir
 * @param val - Saat: SS:DD veya SSDD formatındaki saat
 * @returns Saatin dakika cinsinden değeri (h * 60 + m) veya null (geçersiz saat formatı)
 * @example
 * workingHourDigitsToMinutes('09:30') // 570
 * workingHourDigitsToMinutes('0930') // 570
 * workingHourDigitsToMinutes('930') // 570
 * workingHourDigitsToMinutes('9:30') // 570
 * workingHourDigitsToMinutes('9:30:00') // 570
 * workingHourDigitsToMinutes('9:30:00') // 570
 */
export function workingHourDigitsToMinutes(val: string | null): number | null {
  if (!isValidWorkingHourTime(val)) return null

  const d = (val ?? '').replace(/\D/g, '')
  const h = +d.slice(0, 2)
  const m = +d.slice(2)

  return h * 60 + m
}

// Maskeli saat alanı: kısmi giriş için HHMM kontrolü
export function isValidPartialWorkingHourDigits(d: string): boolean {
  if (!d) return true
  if (!/^\d{1,4}$/.test(d)) return false
  if (d.length === 1) return +d <= 2
  if (d.length === 2) return +d <= 23
  if (d.length === 3) return +d.slice(0, 2) <= 23 && +d[2] <= 5
  return isValidWorkingHourTime(d)
}
