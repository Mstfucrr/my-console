'use client'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import {
  ActiveFiltersDisplay,
  FilterCard,
  SearchInput,
  StatusSelect,
  type FilterOption
} from '@/components/ui/filter-card'
import type { FilterOptions, OrderStatus } from '@/modules/types'
import { format } from 'date-fns'
import { Search, ShoppingBag } from 'lucide-react'
import { useMemo } from 'react'
import type { DateRange } from 'react-day-picker'

const statuses: FilterOption[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'preparing', label: 'Hazırlanıyor' },
  { value: 'ready', label: 'Hazır' },
  { value: 'picked_up', label: 'Kurye aldı' },
  { value: 'on_way', label: 'Yolda' },
  { value: 'delivered', label: 'Teslim edildi' },
  { value: 'cancelled', label: 'İptal edildi' }
]

export function OrderFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: FilterOptions
  onFiltersChange: (f: FilterOptions) => void
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
        title: 'Sipariş Filtreleme ve Arama',
        icon: ShoppingBag,
        searchPlaceholder: 'Sipariş No / Müşteri / Adres...',
        statusOptions: statuses,
        showDateFilters: true
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
              placeholder='Sipariş No / Müşteri / Adres...'
              value={filters.search ?? ''}
              onChange={value => onFiltersChange({ ...filters, search: value })}
              Icon={Search}
            />
          </div>
          <div className='min-w-[140px]'>
            <StatusSelect
              options={statuses}
              value={filters.status ?? 'all'}
              onChange={value => onFiltersChange({ ...filters, status: value as OrderStatus | undefined })}
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
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && <ActiveFiltersDisplay filters={filters} statusOptions={statuses} />}
    </FilterCard>
  )
}
