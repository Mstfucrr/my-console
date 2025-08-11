'use client'

import {
  ActiveFiltersDisplay,
  FilterCard,
  SearchInput,
  StatusSelect,
  type FilterOption
} from '@/components/ui/filter-card'
import { Search, StoreIcon as Shop } from 'lucide-react'

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Pasif' }
]

export function RestaurantFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: { search?: string; status?: 'all' | 'active' | 'inactive' | undefined }
  onFiltersChange: (f: { search?: string; status?: 'all' | 'active' | 'inactive' | undefined }) => void
  onClearFilters: () => void
}) {
  const hasActiveFilters = Boolean(filters.search || filters.status !== 'all')

  const config = {
    title: 'Restoran Filtreleme ve Arama',
    icon: Shop,
    searchPlaceholder: 'Restoran ara...',
    statusOptions,
    tipText: 'Restoran adı, adres veya telefon numarasına göre arama yapabilirsiniz.'
  }

  return (
    <FilterCard
      config={config}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
    >
      <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
        <SearchInput
          placeholder='Restoran ara...'
          value={filters.search ?? ''}
          onChange={value => onFiltersChange({ ...filters, search: value })}
          Icon={Search}
        />
        <StatusSelect
          options={statusOptions}
          value={filters.status ?? 'all'}
          onChange={value =>
            onFiltersChange({ ...filters, status: value as 'all' | 'active' | 'inactive' | undefined })
          }
        />
      </div>

      {hasActiveFilters && <ActiveFiltersDisplay filters={filters} statusOptions={statusOptions} />}
    </FilterCard>
  )
}
