'use client'

import { cn } from '@/lib/utils'
import type { Order } from '@/modules/types'
import { Loader2, ShoppingCart } from 'lucide-react'
import { useOrders } from '../../context/OrdersContext'
import { OrderCard } from './OrderCard'
import { OrderListItem } from './OrderListItem'

interface OrdersListProps {
  orders: Order[]
  isLoading: boolean
  isFetching: boolean
  viewMode: 'card' | 'list'
  emptyMessage: string
  filteredEmptyMessage: string
}

export function OrdersList({
  orders,
  isLoading,
  isFetching,
  viewMode,
  emptyMessage,
  filteredEmptyMessage
}: OrdersListProps) {
  const { statusFilter, handleViewDetails } = useOrders()

  if (isLoading || isFetching) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='text-muted-foreground mx-auto mb-4 h-12 w-12 animate-spin' />
          <p className='text-muted-foreground'>Siparişler yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <div className='text-center'>
          <ShoppingCart className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <p className='text-muted-foreground'>{statusFilter ? filteredEmptyMessage : emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 gap-4', viewMode === 'list' ? 'grid-cols-1' : 'md:grid-cols-3')}>
      {orders.map(order =>
        viewMode === 'card' ? (
          <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
        ) : (
          <OrderListItem key={order.id} order={order} onViewDetails={handleViewDetails} />
        )
      )}
    </div>
  )
}
