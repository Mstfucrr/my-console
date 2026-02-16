'use client'

import { FilterCard, SearchInput, StatusSelect, type GroupedFilterOption } from '@/components/ui/filter-card'
import { OperationDateFilters } from '@/components/ui/operation-date-range-picker'
import { useFilter } from '@/hooks/use-filter'
import { normalizeSearch, track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import { ReportFiltersAppliedEvent } from '@/lib/analytics/types'
import { groupPaymentMethods } from '@/lib/payment-methods'
import { usePaymentMethods } from '@/service/payment-methods.service'
import { OrderStatusesGroups, PaymentMethod } from '@/types'
import { Loader2, Search } from 'lucide-react'
import { useMemo } from 'react'
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

const getStatusLabel = (status: OrderStatusesGroups | 'all') =>
  STATUS_OPTIONS.find(option => option.value === status)?.label?.toString() ?? 'all'

const getPaymentMethodLabel = (
  paymentMethods: Array<PaymentMethod> | undefined,
  paymentMethodId: string | undefined
) =>
  paymentMethodId ? (paymentMethods?.find(method => method.id === paymentMethodId)?.name.toString() ?? 'all') : 'all'

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

  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = usePaymentMethods()

  const paymentMethodOptionsGrouped = useMemo<GroupedFilterOption[] | undefined>(() => {
    const grouped = groupPaymentMethods(paymentMethods, true)
    if (!grouped) return undefined

    return [{ items: [{ value: 'all', label: 'Ödeme Yöntemleri' }] }, ...grouped]
  }, [paymentMethods])

  const handleApply = () => {
    track<ReportFiltersAppliedEvent>(ANALYTICS_EVENTS.reportFiltersApplied, {
      status: getStatusLabel(pendingFilters.status),
      payment_method: getPaymentMethodLabel(paymentMethods, pendingFilters.paymentMethod),
      search: normalizeSearch(pendingFilters.search),
      date_range_days:
        pendingFilters.dateRange?.from && pendingFilters.dateRange?.to
          ? Math.ceil(
              (pendingFilters.dateRange.to.getTime() - pendingFilters.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1
          : undefined
    })
    handleApplyFilters()
  }

  return (
    <FilterCard
      filters={filters}
      onFiltersChange={onFiltersChange}
      onClearFilters={handleClearFilters}
      onApply={handleApply}
      hasActiveFilters={hasActiveFilters}
      hasPendingChanges={hasPendingChanges}
    >
      <SearchInput
        placeholder='Sipariş ID veya Müşteri Adı ile arama yapın...'
        value={pendingFilters.search ?? ''}
        onChange={value => updatePendingFilters({ search: value })}
        Icon={Search}
        defaultValue={defaultReportsFilters.search}
      />
      <StatusSelect
        options={STATUS_OPTIONS}
        value={pendingFilters.status ?? 'all'}
        onChange={value => updatePendingFilters({ status: value })}
        placeholder='Durum seçin'
      />

      {isLoadingPaymentMethods ? (
        <div className='flex items-center justify-center'>
          <Loader2 className='size-4 animate-spin' />
        </div>
      ) : paymentMethodOptionsGrouped ? (
        <StatusSelect
          groupedOptions={paymentMethodOptionsGrouped}
          value={pendingFilters.paymentMethod ?? 'all'}
          onChange={value => updatePendingFilters({ paymentMethod: value })}
          placeholder='Ödeme yöntemi seçin'
        />
      ) : null}
      <OperationDateFilters
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
