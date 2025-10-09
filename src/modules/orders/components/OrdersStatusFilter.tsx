'use client'

import { Button } from '@/components/ui/button'
import { OrderStatus, OrderStatusLabel } from '@/modules/types'
import { useOrders } from '../context/OrdersContext'

const statusConfig = [
  {
    status: 'created' as OrderStatus,
    label: OrderStatusLabel.created,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    status: 'shipped' as OrderStatus,
    label: OrderStatusLabel.shipped,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    status: 'delivered' as OrderStatus,
    label: OrderStatusLabel.delivered,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    status: 'cancelled' as OrderStatus,
    label: OrderStatusLabel.cancelled,
    color: 'bg-red-100 text-red-800 border-red-200'
  }
]

export function OrdersStatusFilter() {
  const { statusFilter, handleStatusFilterChange } = useOrders()

  const handleStatusClick = (status: OrderStatus) => {
    if (statusFilter && statusFilter.includes(status)) {
      const newFilter = statusFilter.filter(s => s !== status)
      handleStatusFilterChange(newFilter.length > 0 ? newFilter : null)
    } else {
      // Add status to filter
      const newFilter = statusFilter ? [...statusFilter, status] : [status]
      handleStatusFilterChange(newFilter)
    }
  }

  const isStatusActive = (status: OrderStatus) => statusFilter && statusFilter.includes(status)

  return (
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
  )
}
