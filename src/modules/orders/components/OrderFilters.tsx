import {
  ActiveFiltersDisplay,
  DateFilters,
  FilterCard,
  SearchInput,
  StatusSelect,
  type FilterOption
} from '@/components/ui/filter-card'
import type { FilterOptions, OrderStatus } from '@/modules/types'
import { Search, ShoppingBag } from 'lucide-react'
import { useMemo } from 'react'

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

  const config = {
    title: 'Sipariş Filtreleme ve Arama',
    icon: ShoppingBag,
    searchPlaceholder: 'Sipariş No / Müşteri / Adres...',
    statusOptions: statuses,
    showDateFilters: true
  }

  return (
    <FilterCard
      config={config}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
    >
      <div className='flex w-full gap-3'>
        <div className='flex flex-auto flex-col items-start gap-3 sm:flex-row sm:items-center'>
          <div className='flex-1'>
            <SearchInput
              placeholder='Sipariş No / Müşteri / Adres...'
              value={filters.search ?? ''}
              onChange={value => onFiltersChange({ ...filters, search: value })}
              Icon={Search}
            />
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <StatusSelect
              options={statuses}
              value={filters.status ?? 'all'}
              onChange={value => onFiltersChange({ ...filters, status: value as OrderStatus | undefined })}
              placeholder='Durum seçin'
            />
          </div>
        </div>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <DateFilters
            dateFrom={filters.dateFrom ?? ''}
            dateTo={filters.dateTo ?? ''}
            onDateFromChange={value => onFiltersChange({ ...filters, dateFrom: value })}
            onDateToChange={value => onFiltersChange({ ...filters, dateTo: value })}
          />
        </div>
      </div>

      {hasActiveFilters && <ActiveFiltersDisplay filters={filters} statusOptions={statuses} />}
    </FilterCard>
  )
}
