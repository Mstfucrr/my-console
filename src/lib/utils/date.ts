import { isSameDay, isSameHour, isSameMinute } from 'date-fns'
import type { DateRange } from 'react-day-picker'

export function formatDateTR(dateString: string | undefined) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('tr-TR')
}

export function formatDateTimeTR(dateString: string | undefined) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateForApi(date?: Date | string) {
  if (!date) return undefined
  const inputDate = new Date(date)
  inputDate.setHours(inputDate.getHours() + 3)
  return inputDate.toISOString().slice(0, 16)
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
