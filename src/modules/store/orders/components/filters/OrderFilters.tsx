'use client'

import { FilterCard, SearchInput, SortSelect, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { OrderStatusGroup } from '@/constants/orders'
import { useFilter } from '@/hooks/use-filter'
import { normalizeSearch, track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import { OrdersFiltersAppliedEvent } from '@/lib/analytics/types'
import { useViewModeStore } from '@/store/view-mode'
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

const sortByOptions: FilterOption[] = [
  { value: 'createdAt', label: 'Oluşturulma Tarihi' },
  { value: 'customerName', label: 'Müşteri Adı' },
  { value: 'status', label: 'Durum' },
  { value: 'channel', label: 'Kanal' },
  { value: 'courierInfo', label: 'Kurye' },
  { value: 'paymentType', label: 'Ödeme Yöntemi' },
  { value: 'totalAmount', label: 'Tutar' },
  { value: 'completionTime', label: 'Tamamlanma Süresi' }
] as const

const getStatusLabel = (status: OrderStatusesGroups | 'all') => {
  return statusOptions.find(option => option.value === status)?.label?.toString() ?? 'all'
}

export function OrderFilters() {
  const viewMode = useViewModeStore(state => state.viewMode)
  const { filters, handleFiltersChange, clearFilters, sorting, setSorting, activeTab } = useOrders()
  const {
    pendingFilters,
    hasActiveFilters,
    hasPendingChanges,
    handleApplyFilters,
    handleClearFilters,
    updatePendingFilters
  } = useFilter<OrderFilterProperties>(filters, handleFiltersChange, clearFilters, defaultOrderFilters)

  const handleApply = () => {
    track<OrdersFiltersAppliedEvent>(ANALYTICS_EVENTS.ordersFiltersApplied, {
      status: getStatusLabel(pendingFilters.status),
      search: normalizeSearch(pendingFilters.search)
    })
    handleApplyFilters()
  }

  return (
    <FilterCard
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onClearFilters={handleClearFilters}
      onApply={handleApply}
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
        defaultValue={defaultOrderFilters.search}
      />
      {/* Status Select */}
      <StatusSelect
        options={statusOptions}
        value={pendingFilters.status ?? 'all'}
        onChange={value => updatePendingFilters({ status: value as OrderFilterProperties['status'] })}
        placeholder='Durum seçin'
        showLabel={false}
      />

      {viewMode === 'card' && (
        <SortSelect
          sortByOptions={
            // Eğer aktif tab tamamlanmış siparişler ise, tamamlanma süresi sıralama seçeneğini de gösterir
            activeTab === 'completed'
              ? sortByOptions
              : sortByOptions.filter(option => option.value !== 'completionTime')
          }
          sorting={sorting}
          onSortingChange={setSorting}
          placeholder='Sıralama'
          showLabel={false}
          data-testid='order-sort-select'
        />
      )}
    </FilterCard>
  )
}
