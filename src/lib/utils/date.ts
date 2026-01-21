import { formatDuration as formatDurationFns, intervalToDuration, isSameDay, isSameHour, isSameMinute } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'

export function formatDateTR(dateString: string | undefined, includeTime = false) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: includeTime ? '2-digit' : undefined,
    minute: includeTime ? '2-digit' : undefined,
    timeZone: 'UTC'
  })
}

export function formatDateTimeTR(dateString: string | undefined) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

export function formatDateDifferentString(startDate: string, endDate: string) {
  if (!startDate || !endDate) return ''
  return formatDuration(startDate, endDate)
}

export function formatDuration(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return ''

  const start = new Date(startDate)
  const end = new Date(endDate)

  const duration = intervalToDuration({ start, end })
  return formatDurationFns(duration, {
    format: !duration.minutes ? ['seconds'] : ['hours', 'minutes'],
    locale: tr
  })
}

export function formatDateForApi(date?: Date | string) {
  if (!date) return undefined
  const inputDate = new Date(date)
  inputDate.setHours(inputDate.getHours() + 3)
  return inputDate.toISOString().slice(0, 16)
}

/**
 * Date objesini getOperationDateRange formatına çevirir (YYYY-MM-DDTHH:mm)
 * Örnek: 2026-01-17T05:00
 */
export function formatDateToApiString(date: Date | undefined): string | undefined {
  if (!date) return undefined
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function isSameDateRange(dateRange1?: DateRange, dateRange2?: DateRange) {
  if (!dateRange1 || !dateRange2) return false
  if (!dateRange1.from || !dateRange1.to) return false
  if (!dateRange2.from || !dateRange2.to) return false
  return (
    isSameDay(dateRange1.from, dateRange2.from) &&
    isSameHour(dateRange1.from, dateRange2.from) &&
    isSameMinute(dateRange1.from, dateRange2.from) &&
    isSameDay(dateRange1.to, dateRange2.to) &&
    isSameHour(dateRange1.to, dateRange2.to) &&
    isSameMinute(dateRange1.to, dateRange2.to)
  )
}
