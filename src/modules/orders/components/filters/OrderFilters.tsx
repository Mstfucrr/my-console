'use client'

import { FilterCard, SearchInput, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { useFilter } from '@/hooks/use-filter'
import { OrderStatusLabel } from '@/modules/types'
import { Filter, Search } from 'lucide-react'
import { defaultOrderFilters, useOrders } from '../../context/OrdersContext'
import type { OrderFilterProperties } from '../../types'

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'created', label: OrderStatusLabel.created },
  { value: 'shipped', label: OrderStatusLabel.shipped },
  { value: 'delivered', label: OrderStatusLabel.delivered },
  { value: 'cancelled', label: OrderStatusLabel.cancelled }
]

export function OrderFilters() {
  const { filters, handleFiltersChange, clearFilters } = useOrders()
  const {
    pendingFilters,
    hasActiveFilters,
    hasPendingChanges,
    handleApplyFilters,
    handleClearFilters,
    updatePendingFilters
  } = useFilter<OrderFilterProperties>(filters, handleFiltersChange, clearFilters, defaultOrderFilters)

  return (
    <FilterCard
      config={{
        title: 'Sipariş Filtreleri',
        icon: Filter,
        statusOptions: statusOptions,
        showDateFilters: false
      }}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onClearFilters={handleClearFilters}
      onApply={handleApplyFilters}
      hasActiveFilters={hasActiveFilters}
      hasPendingChanges={hasPendingChanges}
    >
      <div className='flex w-full flex-col gap-4 lg:flex-row lg:items-end'>
        {/* Search Input */}
        <SearchInput
          placeholder='Sipariş ID, müşteri adı, telefon numarası ile arama yapın...'
          value={pendingFilters.search ?? ''}
          onChange={value => updatePendingFilters({ search: value })}
          Icon={Search}
          showLabel={false}
          className='w-full'
        />
        {/* Status Select */}
        <StatusSelect
          options={statusOptions}
          value={pendingFilters.status ?? 'all'}
          onChange={value => updatePendingFilters({ status: value as OrderFilterProperties['status'] })}
          placeholder='Durum seçin'
          showLabel={false}
        />
      </div>
    </FilterCard>
  )
}
