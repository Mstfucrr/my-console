'use client'

import { isSameDateRange } from '@/lib/utils/date'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useMemo } from 'react'
import type { DateRange } from 'react-day-picker'
import { ButtonProps } from './button'
import { DateRangePicker, type DateRangePickerProps } from './date-range-picker'

interface OperationDateRangePickerProps extends Omit<DateRangePickerProps, 'dateRange' | 'onDateRangeChange'> {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
}

/**
 * Operation Date Range Picker
 * Seçilen tarih aralığını operation date range formatına çevirir:
 * - Kullanıcı 13 Ocak seçerse -> 13 Ocak 05:00 - 14 Ocak 05:00 olarak görünür ve gönderilir
 * - Kullanıcı 13 Ocak - 15 Ocak seçerse -> 13 Ocak 05:00 - 16 Ocak 05:00 olarak görünür ve gönderilir
 *
 * Calendar'da kullanıcı sadece tarih seçer (saat yok), ama görüntüleme ve backend'e gönderim
 * operation formatında olur (05:00 ile başlayıp ertesi gün 05:00 ile biter)
 */
export function OperationDateRangePicker({
  dateRange,
  onDateRangeChange,
  defaultDateRange,
  ...props
}: OperationDateRangePickerProps & ButtonProps) {
  // Calendar'da göstermek için: dateRange operation formatında geliyor (05:00 ile)
  // Calendar'da sadece tarih seçiliyor, bu yüzden saat bilgisini kaldırıyoruz
  const calendarDateRange = useMemo<DateRange | undefined>(() => {
    if (!dateRange?.from) return undefined

    // Calendar için sadece tarih kısmını al (saat bilgisi olmadan)
    const from = new Date(dateRange.from)
    from.setHours(0, 0, 0, 0)

    // End date varsa, bir gün geri al (çünkü operation formatında end bir gün sonra)
    // Örnek: 13 Ocak 05:00 - 14 Ocak 05:00 -> Calendar'da 13 Ocak - 13 Ocak görünmeli
    if (dateRange.to) {
      const to = new Date(dateRange.to)
      to.setDate(to.getDate() - 1) // Bir gün geri al
      to.setHours(0, 0, 0, 0)
      return { from, to }
    }

    return { from }
  }, [dateRange])

  // Default date range'ı calendar formatına çevir
  const calendarDefaultDateRange = useMemo<DateRange | undefined>(() => {
    if (!defaultDateRange?.from) return undefined

    const from = new Date(defaultDateRange.from)
    from.setHours(0, 0, 0, 0)

    if (defaultDateRange.to) {
      const to = new Date(defaultDateRange.to)
      to.setDate(to.getDate() - 1) // Bir gün geri al
      to.setHours(0, 0, 0, 0)
      return { from, to }
    }

    return { from }
  }, [defaultDateRange])

  // Kullanıcı calendar'da tarih seçtiğinde, operation date range formatına çevir
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range?.from) {
      onDateRangeChange(undefined)
      return
    }

    // Start: Seçilen tarihin 05:00'ı
    const start = new Date(range.from)
    start.setHours(5, 0, 0, 0)

    // End: Eğer 'to' varsa onun ertesi günü 05:00, yoksa start'ın ertesi günü 05:00
    const endDate = range.to || range.from
    const end = new Date(endDate)
    end.setDate(end.getDate() + 1)
    end.setHours(5, 0, 0, 0)

    onDateRangeChange({
      from: start,
      to: end
    })
  }

  // Display text'i sadece tarih olarak göster (saat yok)
  // Backend'e gönderim operation formatında olacak (05:00 ile)
  const displayText = useMemo(() => {
    if (!dateRange?.from) return props.defaultText ?? props.placeholder ?? 'Tarih aralığı seçin'

    // Calendar'da gösterilecek tarihleri al (operation formatından calendar formatına çevir)
    const from = new Date(dateRange.from)
    from.setHours(0, 0, 0, 0)

    // End date varsa, bir gün geri al (çünkü operation formatında end bir gün sonra)
    // Örnek: 12 Ocak 05:00 - 13 Ocak 05:00 -> "12 Oca 2026 - 12 Oca 2026" görünmeli
    if (dateRange.to) {
      const to = new Date(dateRange.to)
      to.setDate(to.getDate() - 1) // Bir gün geri al
      to.setHours(0, 0, 0, 0)
      return `${format(from, 'dd MMM yyyy', { locale: tr })} - ${format(to, 'dd MMM yyyy', { locale: tr })}`
    }
    return format(from, 'dd MMM yyyy', { locale: tr })
  }, [dateRange, props.defaultText, props.placeholder])

  const isDefaultDateRange = isSameDateRange(dateRange, defaultDateRange)
  const finalDisplayText = isDefaultDateRange
    ? (props.defaultText ?? props.placeholder ?? 'Tarih aralığı seçin')
    : displayText

  return (
    <DateRangePicker
      {...props}
      dateRange={calendarDateRange}
      defaultDateRange={calendarDefaultDateRange}
      onDateRangeChange={handleDateRangeChange}
      enableTimeSelection={false}
      customDisplayText={finalDisplayText}
    />
  )
}

/**
 * Operation Date Filters - FilterCard ile uyumlu wrapper
 * DateFilters component'inin operation date range versiyonu
 */
export function OperationDateFilters({
  dateRange,
  onDateRangeChange,
  placeholder = 'Tarih aralığı seçin',
  showLabel = false,
  defaultDateRange,
  ...props
}: {
  dateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
  placeholder?: string
  showLabel?: boolean
  defaultDateRange?: DateRange
} & Omit<DateRangePickerProps, 'dateRange' | 'onDateRangeChange' | 'defaultDateRange'>) {
  const isDefaultDateRange = isSameDateRange(dateRange, defaultDateRange)
  const isActive = dateRange && (dateRange.from || dateRange.to) && !isDefaultDateRange

  return (
    <div>
      {showLabel && <label className='text-muted-foreground mb-1 block text-xs'>Tarih Aralığı</label>}
      <OperationDateRangePicker
        dateRange={dateRange}
        defaultDateRange={defaultDateRange}
        onDateRangeChange={onDateRangeChange}
        placeholder={placeholder}
        size='xs'
        color={isActive ? 'info' : undefined}
        variant={isActive ? 'soft' : 'outline'}
        {...props}
      />
    </div>
  )
}
