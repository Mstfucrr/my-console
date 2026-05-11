'use client'

import { FilterCard, SearchInput, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { useFilter, type BaseFilterProperties } from '@/hooks/use-filter'
import { useQueryProvinces } from '@/service/location.service'
import { Search } from 'lucide-react'
import { useMemo } from 'react'
import { useStoreApplicationStatusesQuery } from '../../hooks/useStoreApplicationStatusesQuery'

export interface StoreApplicationsFilterProperties extends BaseFilterProperties {
  search: string
  /** API `key`; tüm durumlar için `all` */
  status: string
  /** `all` veya `il_adi` (tam eşleşme) */
  city: string
}

export const defaultStoreApplicationsFilters: StoreApplicationsFilterProperties = {
  search: '',
  status: 'all',
  city: 'all'
}

export function ApplicationsFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: StoreApplicationsFilterProperties
  onFiltersChange: (f: StoreApplicationsFilterProperties) => void
  onClearFilters: () => void
}) {
  const { data: provinces } = useQueryProvinces()
  const { data: statuses = [], isPending: statusesLoading } = useStoreApplicationStatusesQuery()

  const provinceOptions: FilterOption[] = useMemo(
    () => [{ value: 'all', label: 'Tüm iller' }, ...(provinces ?? []).map(p => ({ value: p.il_adi, label: p.il_adi }))],
    [provinces]
  )

  const statusOptions: FilterOption[] = useMemo(
    () => [{ value: 'all', label: 'Tüm Durumlar' }, ...statuses.map(s => ({ value: s.code, label: s.value }))],
    [statuses]
  )

  const {
    pendingFilters,
    hasActiveFilters,
    hasPendingChanges,
    handleApplyFilters,
    handleClearFilters,
    updatePendingFilters
  } = useFilter(filters, onFiltersChange, onClearFilters, defaultStoreApplicationsFilters)

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
        defaultValue={defaultStoreApplicationsFilters.search}
      />
      <StatusSelect
        options={provinceOptions}
        value={pendingFilters.city ?? 'all'}
        onChange={value => updatePendingFilters({ city: value })}
        placeholder='İl seçin'
      />
      <StatusSelect
        options={statusOptions}
        value={pendingFilters.status ?? 'all'}
        onChange={value => updatePendingFilters({ status: value })}
        placeholder='Durum seçin'
        isLoading={statusesLoading}
      />
    </FilterCard>
  )
}
