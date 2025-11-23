'use client'

import { DateFilters, FilterCard, SearchInput, StatusSelect } from '@/components/ui/filter-card'
import { useFilter } from '@/hooks/use-filter'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import { useMemo } from 'react'
import type { DateRange } from 'react-day-picker'
import { PAYMENT_METHOD_OPTIONS, STATUS_OPTIONS } from '../constants'

const MIN_MAX_DATE_RANGE = {
  rangeStart: new Date(new Date().setDate(new Date().getDate() - 30)),
  rangeEnd: new Date()
}

export interface ReportsFilterProperties {
  status: string
  search: string
  paymentMethod: string
  dateFrom?: string
  dateTo?: string
}

const defaultFilters: ReportsFilterProperties = {
  search: '',
  status: 'all',
  paymentMethod: 'all',
  dateFrom: undefined,
  dateTo: undefined
}

export function ReportsFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: ReportsFilterProperties
  onFiltersChange: (f: ReportsFilterProperties) => void
  onClearFilters: () => void
}) {
  const {
    pendingFilters,
    hasActiveFilters,
    hasPendingChanges,
    handleApplyFilters,
    handleClearFilters,
    updatePendingFilters,
    updateHotFilters
  } = useFilter(filters, onFiltersChange, onClearFilters, defaultFilters)

  // Convert pending filters to DateRange for the picker
  const dateRange: DateRange | undefined = useMemo(() => {
    if (!pendingFilters.dateFrom && !pendingFilters.dateTo) return undefined
    return {
      from: pendingFilters.dateFrom ? new Date(pendingFilters.dateFrom) : undefined,
      to: pendingFilters.dateTo ? new Date(pendingFilters.dateTo) : undefined
    }
  }, [pendingFilters.dateFrom, pendingFilters.dateTo])

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    updateHotFilters({
      dateFrom: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined
    })
  }

  return (
    <FilterCard
      filters={filters}
      onFiltersChange={onFiltersChange}
      onClearFilters={handleClearFilters}
      onApply={handleApplyFilters}
      hasActiveFilters={hasActiveFilters}
      hasPendingChanges={hasPendingChanges}
    >
      <div className='flex w-full flex-col gap-4 lg:flex-row lg:items-end'>
        <div className='flex flex-1 flex-col gap-3 sm:flex-row sm:items-end'>
          <div className='flex-1'>
            <SearchInput
              placeholder='Sipariş no, müşteri adı veya telefon ara...'
              value={pendingFilters.search ?? ''}
              onChange={value => updatePendingFilters({ search: value })}
              Icon={Search}
            />
          </div>
          <div className='min-w-[140px]'>
            <StatusSelect
              options={STATUS_OPTIONS}
              value={pendingFilters.status ?? 'all'}
              onChange={value => updatePendingFilters({ status: value })}
              placeholder='Durum seçin'
            />
          </div>
          <div className='min-w-[160px]'>
            <StatusSelect
              options={PAYMENT_METHOD_OPTIONS}
              value={pendingFilters.paymentMethod ?? 'all'}
              onChange={value => updatePendingFilters({ paymentMethod: value })}
              placeholder='Ödeme yöntemi seçin'
            />
          </div>
        </div>
        <div className='flex items-end'>
          <DateFilters
            dateRange={dateRange}
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
          />
        </div>
      </div>
    </FilterCard>
  )
}
