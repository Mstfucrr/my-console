import { useEffect, useMemo, useState } from 'react'

export interface FilterProperties {
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

export function useFilter<T extends FilterProperties>(
  filters: T,
  onFiltersChange: (filters: T) => void,
  onClearFilters: () => void
) {
  // Local state for pending changes
  const [pendingFilters, setPendingFilters] = useState<T>(filters)

  // Update pending filters when external filters change
  useEffect(() => {
    setPendingFilters(filters)
  }, [filters])

  const hasActiveFilters = useMemo(
    () => Boolean(filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo),
    [filters]
  )

  const hasPendingChanges = useMemo(() => {
    console.log('search', pendingFilters.search, filters.search)
    return (
      pendingFilters.status !== filters.status ||
      pendingFilters.search !== filters.search ||
      pendingFilters.dateFrom !== filters.dateFrom ||
      pendingFilters.dateTo !== filters.dateTo
    )
  }, [pendingFilters, filters])

  // Apply filters
  const handleApplyFilters = () => {
    onFiltersChange(pendingFilters)
  }

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      status: 'all',
      search: '',
      dateFrom: undefined,
      dateTo: undefined
    } as T
    setPendingFilters(clearedFilters)
    onClearFilters()
  }

  // Update pending filters
  const updatePendingFilters = (updates: Partial<T>) => {
    setPendingFilters(prev => ({ ...prev, ...updates }))
  }

  return {
    pendingFilters,
    hasActiveFilters,
    hasPendingChanges,
    handleApplyFilters,
    handleClearFilters,
    updatePendingFilters
  }
}
