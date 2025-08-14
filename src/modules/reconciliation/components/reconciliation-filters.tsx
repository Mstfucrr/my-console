'use client'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import {
  ActiveFiltersDisplay,
  FilterCard,
  SearchInput,
  StatusSelect,
  type FilterOption
} from '@/components/ui/filter-card'
import { format } from 'date-fns'
import { Filter, Search } from 'lucide-react'
import { useMemo } from 'react'
import type { DateRange } from 'react-day-picker'

const statuses: FilterOption[] = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'completed', label: 'Tamamlandı' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'failed', label: 'Başarısız' }
]

export interface ReconciliationFilterProperties {
  status: string
  search: string
  dateFrom?: string
  dateTo?: string
}

export function ReconciliationFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: ReconciliationFilterProperties
  onFiltersChange: (f: ReconciliationFilterProperties) => void
  onClearFilters: () => void
}) {
  const hasActiveFilters = useMemo(
    () => Boolean(filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo),
    [filters]
  )

  // Convert filters to DateRange for the picker
  const dateRange: DateRange | undefined = useMemo(() => {
    if (!filters.dateFrom && !filters.dateTo) return undefined
    return {
      from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      to: filters.dateTo ? new Date(filters.dateTo) : undefined
    }
  }, [filters.dateFrom, filters.dateTo])

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({
      ...filters,
      dateFrom: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined
    })
  }

  return (
    <FilterCard
      config={{
        title: 'Mutabakat Filtreleri',
        icon: Filter,
        searchPlaceholder: 'Mutabakat kaydı ara...',
        statusOptions: statuses,
        showDateFilters: true,
        tipText: 'Tarih aralığı ve durum filtrelerini kullanarak mutabakat kayıtlarını filtreleyebilirsiniz.'
      }}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
    >
      <div className='flex w-full flex-col gap-4 lg:flex-row lg:items-end'>
        <div className='flex flex-1 flex-col gap-3 sm:flex-row sm:items-end'>
          <div className='flex-1'>
            <SearchInput
              placeholder='Mutabakat kaydı ara...'
              value={filters.search ?? ''}
              onChange={value => onFiltersChange({ ...filters, search: value })}
              Icon={Search}
            />
          </div>
          <div className='min-w-[140px]'>
            <StatusSelect
              options={statuses}
              value={filters.status ?? 'all'}
              onChange={value => onFiltersChange({ ...filters, status: value })}
              placeholder='Durum seçin'
            />
          </div>
        </div>
        <div className='flex items-end'>
          <div>
            <label className='text-muted-foreground mb-1 block text-xs'>Tarih Aralığı</label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              placeholder='Tarih aralığı seçin'
              size='xs'
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && <ActiveFiltersDisplay filters={filters} statusOptions={statuses} />}
    </FilterCard>
  )
}
