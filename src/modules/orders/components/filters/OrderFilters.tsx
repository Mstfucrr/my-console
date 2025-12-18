'use client'

import { FilterCard, SearchInput, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { OrderStatusGroup } from '@/constants/orders'
import { useFilter } from '@/hooks/use-filter'
import { OrderStatusesGroups } from '@/types'
import { Search } from 'lucide-react'
import { defaultOrderFilters, useOrders } from '../../context/OrdersContext'
import type { OrderFilterProperties } from '../../types'

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'Tümü' },
  { value: OrderStatusesGroups.CREATED, label: OrderStatusGroup[OrderStatusesGroups.CREATED].label },
  { value: OrderStatusesGroups.SHIPPED, label: OrderStatusGroup[OrderStatusesGroups.SHIPPED].label },
  { value: OrderStatusesGroups.DELIVERED, label: OrderStatusGroup[OrderStatusesGroups.DELIVERED].label },
  { value: OrderStatusesGroups.CANCELLED, label: OrderStatusGroup[OrderStatusesGroups.CANCELLED].label }
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
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onClearFilters={handleClearFilters}
      onApply={handleApplyFilters}
      hasActiveFilters={hasActiveFilters}
      hasPendingChanges={hasPendingChanges}
    >
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
    </FilterCard>
  )
}
