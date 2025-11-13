'use client'

import { Button } from '@/components/ui/button'
import { FilterCard, SearchInput, type FilterOption } from '@/components/ui/filter-card'
import { ORDER_STATUS_COLORS } from '@/constants'
import { OrderStatus, OrderStatusLabel } from '@/modules/types'
import { Filter, Search } from 'lucide-react'
import { useOrders } from '../../context/OrdersContext'

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'created', label: OrderStatusLabel.created },
  { value: 'shipped', label: OrderStatusLabel.shipped },
  { value: 'delivered', label: OrderStatusLabel.delivered },
  { value: 'cancelled', label: OrderStatusLabel.cancelled }
]

const statusConfig = [
  {
    status: 'created' as OrderStatus,
    label: OrderStatusLabel.created,
    color: ORDER_STATUS_COLORS['created']
  },
  {
    status: 'shipped' as OrderStatus,
    label: OrderStatusLabel.shipped,
    color: ORDER_STATUS_COLORS['shipped']
  },
  {
    status: 'delivered' as OrderStatus,
    label: OrderStatusLabel.delivered,
    color: ORDER_STATUS_COLORS['delivered']
  },
  {
    status: 'cancelled' as OrderStatus,
    label: OrderStatusLabel.cancelled,
    color: ORDER_STATUS_COLORS['cancelled']
  }
]

export function OrderFilters() {
  const { searchTerm, setSearchTerm, statusFilter, handleStatusFilterChange, clearFilter } = useOrders()

  const hasActiveFilters = Boolean(searchTerm || (statusFilter && statusFilter.length > 0))

  const handleStatusClick = (status: OrderStatus) => {
    if (statusFilter && statusFilter.includes(status)) {
      const newFilter = statusFilter.filter(s => s !== status)
      handleStatusFilterChange(newFilter.length > 0 ? newFilter : null)
    } else {
      const newFilter = statusFilter ? [...statusFilter, status] : [status]
      handleStatusFilterChange(newFilter)
    }
  }

  const isStatusActive = (status: OrderStatus) => statusFilter && statusFilter.includes(status)

  return (
    <FilterCard
      config={{
        title: 'Sipariş Filtreleri',
        icon: Filter,
        statusOptions: statusOptions,
        showDateFilters: false
      }}
      filters={{ search: searchTerm, status: 'all' }}
      onFiltersChange={() => {}}
      onClearFilters={clearFilter}
      hasActiveFilters={hasActiveFilters}
      hasPendingChanges={false}
    >
      <div className='flex w-full flex-wrap gap-4'>
        <div className='flex min-w-[300px] flex-1 flex-col gap-3 sm:flex-row sm:items-end'>
          <SearchInput
            placeholder='Sipariş ID, müşteri adı, telefon numarası ile arama yapın...'
            value={searchTerm ?? ''}
            onChange={value => setSearchTerm(value || '')}
            Icon={Search}
            showLabel={false}
            className='w-full'
          />
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          {statusConfig.map(({ status, label, color }) => (
            <Button
              key={status}
              variant={isStatusActive(status) ? 'soft' : 'outline'}
              size='xs'
              onClick={() => handleStatusClick(status)}
              className={`transition-all ${isStatusActive(status) ? color : 'hover:text-foreground hover:bg-gray-50'}`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </FilterCard>
  )
}
