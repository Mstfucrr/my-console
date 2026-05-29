'use client'

import MapLoading from '@/components/map-loaging'
import { useViewModeStore } from '@/store/view-mode'
import type { Order } from '@/types'
import dynamic from 'next/dynamic'
import { useOrders } from '../../context/OrdersContext'
import { OrderCard } from './OrderCard'
import { OrderCardSkeleton } from './OrderCardSkeleton'
import { TableView } from './TableView'

const MapView = dynamic(() => import('./MapView').then(mod => mod.MapView), {
  ssr: false,
  loading: () => <MapLoading className='h-full' skeletonClassName='min-h-[400px] w-full' />
})

interface OrdersListProps {
  orders: Array<Order> | undefined
  isLoading: boolean
  isFetching: boolean
  emptyMessage: string
  filteredEmptyMessage: string
  onViewDetails: (order: Order) => void
}

export function OrdersList({
  orders,
  isLoading,
  isFetching,
  emptyMessage,
  filteredEmptyMessage,
  onViewDetails
}: OrdersListProps) {
  const { filters } = useOrders()
  const hasActiveFilter = filters.status !== 'all' || Boolean(filters.search)

  const viewMode = useViewModeStore(state => state.viewMode)

  if (viewMode === 'table')
    return (
      <TableView
        orders={orders ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={emptyMessage}
        filteredEmptyMessage={filteredEmptyMessage}
        onViewDetails={onViewDetails}
      />
    )

  if (viewMode === 'map') {
    if (isLoading) return <MapLoading className='h-full' skeletonClassName='min-h-[400px] w-full' />
    return <MapView />
  }

  if (isLoading || isFetching)
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 4 }).map((_, idx) => (
          <OrderCardSkeleton key={idx} />
        ))}
      </div>
    )

  if (orders?.length === 0)
    return (
      <div className='flex h-48 items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground'>{hasActiveFilter ? filteredEmptyMessage : emptyMessage}</p>
        </div>
      </div>
    )

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
      {orders?.map(order => <OrderCard key={order.orderId} order={order} onViewDetails={onViewDetails} />)}
    </div>
  )
}
