'use client'

import { FilterCard, SearchInput, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { OrderStatusGroup } from '@/constants/orders'
import { useFilter } from '@/hooks/use-filter'
import { OrderStatusesGroups } from '@/types'
import { Filter, Search } from 'lucide-react'
import { defaultOrderFilters, useOrders } from '../../context/OrdersContext'
import type { OrderFilterProperties } from '../../types'

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'Tüm Durumlar' },
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
