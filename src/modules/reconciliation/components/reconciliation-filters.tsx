'use client'

import { FilterCard, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { useFilter } from '@/hooks/use-filter'
import { defaultReconciliationFilters } from '..'
import { ReconciliationConfirmStatus, type ReconciliationFilterProperties } from '../types'

const statuses: FilterOption[] = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: ReconciliationConfirmStatus.APPROVED, label: 'Onaylandı' },
  { value: ReconciliationConfirmStatus.PENDING, label: 'Beklemede' },
  { value: ReconciliationConfirmStatus.FAILED, label: 'Onaylanmadı' }
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
          value={pendingFilters.status?.toString()}
          onChange={value => updatePendingFilters({ status: value as ReconciliationFilterProperties['status'] })}
          placeholder='Durum seçin'
          showLabel={false}
        />
      </div>
    </FilterCard>
  )
}
