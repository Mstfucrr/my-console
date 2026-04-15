'use client'

import { FilterCard, SearchInput, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { useFilter, type BaseFilterProperties } from '@/hooks/use-filter'
import { useQueryProvinces } from '@/service/location.service'
import { Search } from 'lucide-react'
import { useMemo } from 'react'

export interface StoresFilterProperties extends BaseFilterProperties {
  /** Şube adı — API `restaurantName` sütunu (LIKE) */
  search: string
  /** `all` veya `il_adi` (tam eşleşme) */
  city: string
}

export const defaultStoresFilters: StoresFilterProperties = {
  search: '',
  city: 'all'
}

export function StoresFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: StoresFilterProperties
  onFiltersChange: (f: StoresFilterProperties) => void
  onClearFilters: () => void
}) {
  const { data: provinces } = useQueryProvinces()
  const provinceOptions = useMemo<FilterOption[]>(() => {
    const list = provinces ?? []
    return [
      { value: 'all', label: 'Tüm iller' },
      ...[...list]
        .sort((a, b) => a.il_adi.localeCompare(b.il_adi, 'tr'))
        .map(p => ({
          value: p.il_adi,
          label: p.il_adi
        }))
    ]
  }, [provinces])

  const {
    pendingFilters,
    hasActiveFilters,
    hasPendingChanges,
    handleApplyFilters,
    handleClearFilters,
    updatePendingFilters
  } = useFilter(filters, onFiltersChange, onClearFilters, defaultStoresFilters)

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
        placeholder='Şube adı ile arama yapın...'
        value={pendingFilters.search ?? ''}
        onChange={value => updatePendingFilters({ search: value })}
        Icon={Search}
        defaultValue={defaultStoresFilters.search}
      />
      <StatusSelect
        options={provinceOptions}
        value={pendingFilters.city ?? 'all'}
        onChange={value => updatePendingFilters({ city: value })}
        placeholder='İl seçin'
      />
    </FilterCard>
  )
}
