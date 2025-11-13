'use client'

import { FilterCard, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { MONTHS, YEARS } from '@/constants/period'
import { useFilter } from '@/hooks/use-filter'
import { Filter } from 'lucide-react'
import { defaultReconciliationFilters } from '..'
import type { ReconciliationFilterProperties } from '../types'

const statuses: FilterOption[] = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'approved', label: 'Onaylandı' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'failed', label: 'Onaylanmadı' }
]

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
  } = useFilter<ReconciliationFilterProperties>(filters, onFiltersChange, onClearFilters, defaultReconciliationFilters)

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
        {/* Status Select */}
        <StatusSelect
          options={statuses}
          value={pendingFilters.status ?? 'all'}
          onChange={value => updatePendingFilters({ status: value })}
          placeholder='Durum seçin'
          showLabel={false}
        />
        {/* Month Select */}
        <StatusSelect
          options={MONTHS.map(month => ({ value: month, label: month }))}
          value={pendingFilters.month ?? ''}
          onChange={value => updatePendingFilters({ month: value })}
          placeholder='Ay seçin'
          showLabel={false}
        />
        {/* Year Select */}
        <StatusSelect
          options={YEARS.map(year => ({ value: year, label: year }))}
          value={pendingFilters.year ?? ''}
          onChange={value => updatePendingFilters({ year: value })}
          placeholder='Yıl seçin'
          showLabel={false}
        />
      </div>
    </FilterCard>
  )
}
