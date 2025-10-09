'use client'

import { Button } from '@/components/ui/button'
import { getStatusColor } from '@/constants'
import { OrderStatus, OrderStatusLabel } from '@/modules/types'
import { useOrders } from '../context/OrdersContext'

const statusConfig = [
  {
    status: 'created' as OrderStatus,
    label: OrderStatusLabel.created,
    color: getStatusColor('created')
  },
  {
    status: 'shipped' as OrderStatus,
    label: OrderStatusLabel.shipped,
    color: getStatusColor('shipped')
  },
  {
    status: 'delivered' as OrderStatus,
    label: OrderStatusLabel.delivered,
    color: getStatusColor('delivered')
  },
  {
    status: 'cancelled' as OrderStatus,
    label: OrderStatusLabel.cancelled,
    color: getStatusColor('cancelled')
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
