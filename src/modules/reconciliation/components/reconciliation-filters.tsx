'use client'

import { DateFilters, FilterCard, SearchInput, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { useFilter } from '@/hooks/use-filter'
import { format } from 'date-fns'
import { Filter, Search } from 'lucide-react'
import { useMemo } from 'react'
import type { DateRange } from 'react-day-picker'

const statuses: FilterOption[] = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'approved', label: 'Onaylandı' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'failed', label: 'Başarısız' }
]

export interface ReconciliationFilterProperties {
  status: string
  search: string
  dateFrom?: string
  dateTo?: string
}

const defaultFilters: ReconciliationFilterProperties = {
  status: 'all',
  search: '',
  dateFrom: undefined,
  dateTo: undefined
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
  const {
    pendingFilters,
    hasActiveFilters,
    hasPendingChanges,
    handleApplyFilters,
    handleClearFilters,
    updatePendingFilters
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
    updatePendingFilters({
      dateFrom: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined
    })
  }

  return (
    <FilterCard
      config={{
        title: 'Mutabakat Filtreleri',
        icon: Filter,
        statusOptions: statuses,
        showDateFilters: true
      }}
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
              placeholder='Mutabakat kaydı ara (id, dönem)'
              value={pendingFilters.search ?? ''}
              onChange={value => updatePendingFilters({ search: value })}
              Icon={Search}
              showLabel={false}
            />
          </div>
          <div className='min-w-[140px]'>
            <StatusSelect
              options={statuses}
              value={pendingFilters.status ?? 'all'}
              onChange={value => updatePendingFilters({ status: value })}
              placeholder='Durum seçin'
              showLabel={false}
            />
          </div>
        </div>
        <div className='flex items-end'>
          <DateFilters
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            placeholder='Tarih aralığı seçin'
            showLabel={false}
          />
        </div>
      </div>
    </FilterCard>
  )
}
