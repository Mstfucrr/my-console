'use client'

import { FilterCard, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { useFilter } from '@/hooks/use-filter'
import { defaultReconciliationFilters } from '..'
import { ReconciliationConfirmStatus, STATUS_TEXT, type ReconciliationFilterProperties } from '../types'

const statuses: FilterOption[] = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: ReconciliationConfirmStatus.APPROVED, label: STATUS_TEXT[ReconciliationConfirmStatus.APPROVED] },
  { value: ReconciliationConfirmStatus.PENDING, label: STATUS_TEXT[ReconciliationConfirmStatus.PENDING] },
  { value: ReconciliationConfirmStatus.FAILED, label: STATUS_TEXT[ReconciliationConfirmStatus.FAILED] }
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
      {/* Status Select */}
      <StatusSelect
        options={statuses}
        value={pendingFilters.status?.toString()}
        onChange={value => updatePendingFilters({ status: value as ReconciliationFilterProperties['status'] })}
        placeholder='Durum seçin'
        showLabel={false}
      />
    </FilterCard>
  )
}
