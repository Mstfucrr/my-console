import { useEffect, useMemo, useState } from 'react'

// Generic filter properties interface
export interface BaseFilterProperties {
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

// Generic useFilter hook that works with any filter properties
export function useFilter<T extends BaseFilterProperties>(
  filters: T,
  onFiltersChange: (filters: T) => void,
  onClearFilters: () => void,
  defaultFilters: T
) {
  // Local state for pending changes
  const [pendingFilters, setPendingFilters] = useState<T>(filters)

  // Update pending filters when external filters change
  useEffect(() => {
    setPendingFilters(filters)
  }, [filters])

  // Generic active filters check - checks all properties dynamically
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([, value]) => {
      // Skip undefined values
      if (value === undefined || value === null) return false

      // Check for non-empty strings (excluding 'all' for select fields)
      if (typeof value === 'string') {
        return value !== '' && value !== 'all'
      }

      // Check for truthy values
      return Boolean(value)
    })
  }, [filters])

  // Generic pending changes check - compares all properties
  const hasPendingChanges = useMemo(() => {
    return Object.keys(pendingFilters).some(key => {
      const pendingValue = pendingFilters[key as keyof T]
      const currentValue = filters[key as keyof T]
      return pendingValue !== currentValue
    })
  }, [pendingFilters, filters])

  // Apply filters
  const handleApplyFilters = () => {
    onFiltersChange(pendingFilters)
  }

  // Clear filters using default values
  const handleClearFilters = () => {
    setPendingFilters(defaultFilters)
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
