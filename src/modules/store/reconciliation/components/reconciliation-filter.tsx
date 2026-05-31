'use client'

import { OperationDateFilters } from '@/components/ui/operation-date-range-picker'
import { differenceInCalendarDays } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { defaultReconciliationDateRange } from '..'

interface ReconciliationFilterProps {
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
}

const MIN_MAX_DATE_RANGE = {
  rangeStart: new Date(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1)).setDate(new Date().getDate() + 1)
  ),
  rangeEnd: new Date()
}

export function ReconciliationFilter({ dateRange, onDateRangeChange }: ReconciliationFilterProps) {
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const fromDate = new Date(range.from)
      const toDate = new Date(range.to)
      const dayDiff = differenceInCalendarDays(toDate, fromDate)
      if (dayDiff > 60) {
        const adjustedToDate = new Date(fromDate)
        adjustedToDate.setDate(fromDate.getDate() + 60)
        onDateRangeChange?.({
          from: fromDate,
          to: adjustedToDate
        })
        return
      }
    }
    onDateRangeChange?.(range)
  }

  return (
    <OperationDateFilters
      defaultDateRange={defaultReconciliationDateRange}
      dateRange={dateRange}
      initialCalendarMonth='to'
      defaultText='Son 2 ay'
      onDateRangeChange={handleDateRangeChange}
      placeholder='Tarih aralığı seçin'
      calendarProps={{
        disabled: {
          before: MIN_MAX_DATE_RANGE.rangeStart,
          after: MIN_MAX_DATE_RANGE.rangeEnd
        },
        startMonth: MIN_MAX_DATE_RANGE.rangeStart,
        endMonth: MIN_MAX_DATE_RANGE.rangeEnd
      }}
      quickClearable
      quickClearableButtonProps={{
        className: 'size-8 p-0'
      }}
    />
  )
}
