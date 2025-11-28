'use client'

import { DateFilters, FilterCard, SearchInput, StatusSelect } from '@/components/ui/filter-card'
import { PAYMENT_METHODS } from '@/constants/paynemt-methods'
import { useFilter } from '@/hooks/use-filter'
import { OrderStatusesGroups } from '@/types'
import { Search } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { defaultReportsFilters } from '..'
import { STATUS_OPTIONS } from '../constants'

const MIN_MAX_DATE_RANGE = {
  rangeStart: new Date(new Date().setDate(new Date().getDate() - 30)),
  rangeEnd: new Date()
}

export interface ReportsFilterProperties {
  status: OrderStatusesGroups | 'all'
  search?: string
  paymentMethod?: string
  dateRange: DateRange
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
    updatePendingFilters
  } = useFilter(filters, onFiltersChange, onClearFilters, defaultReportsFilters)

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    updatePendingFilters({ dateRange: range })
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
      <SearchInput
        placeholder='Sipariş no, müşteri adı veya telefon ara...'
        value={pendingFilters.search ?? ''}
        onChange={value => updatePendingFilters({ search: value })}
        Icon={Search}
      />
      <StatusSelect
        options={STATUS_OPTIONS}
        value={pendingFilters.status ?? 'all'}
        onChange={value => updatePendingFilters({ status: value })}
        placeholder='Durum seçin'
      />

      <StatusSelect
        options={PAYMENT_METHODS}
        value={pendingFilters.paymentMethod ?? 'all'}
        onChange={value => updatePendingFilters({ paymentMethod: value })}
        placeholder='Ödeme yöntemi seçin'
      />
      <DateFilters
        dateRange={pendingFilters.dateRange}
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
        defaultDateRange={defaultReportsFilters.dateRange}
        defaultText='Bugün'
        quickApplyable
        quickClearable
        quickClearableButtonProps={{
          className: 'size-8 p-0'
        }}
      />
    </FilterCard>
  )
}
