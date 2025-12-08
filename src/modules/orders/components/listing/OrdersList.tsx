'use client'

import { BasicDataTable } from '@/components/basic-data-table'
import { Motorcycle } from '@/components/svg'
import { MaskedText } from '@/components/ui/masked-text'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDateTR } from '@/lib/utils/date'
import { maskLastName } from '@/lib/utils/mask'
import type { Order } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { useOrders } from '../../context/OrdersContext'
import { ChannelBadge, OrderStatusBadge, PaymentMethodBadge } from '../Badges'
import type { OrdersViewMode } from '../OrdersTabs'
import { OrderCard } from './OrderCard'
import { OrderCardSkeleton } from './OrderCardSkeleton'

interface OrdersListProps {
  orders: Array<Order> | undefined
  isLoading: boolean
  isFetching: boolean
  viewMode: OrdersViewMode
  emptyMessage: string
  filteredEmptyMessage: string
  onViewDetails: (order: Order) => void
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Oluşturulma Tarihi',
    cell: ({ row }) => <div className='text-muted-foreground text-sm'>{formatDateTR(row.getValue('createdAt'))}</div>
  },
  {
    accessorKey: 'customerName',
    header: 'Müşteri',
    size: 250,
    cell: ({ row }) => (
      <MaskedText
        value={row.getValue('customerName')}
        maskFn={maskLastName}
        defaultMasked={true}
        textClassName='font-medium'
        className='flex flex-row-reverse justify-end'
      />
    )
  },
  {
    accessorKey: 'status',
    header: 'Durum',
    cell: ({ row }) => {
      const order = row.original
      return (
        <div className='flex items-center gap-3'>
          <OrderStatusBadge status={order.status} />
          {order.courierInfo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Motorcycle className='text-primary -ml-1 size-4 shrink-0' />
                </TooltipTrigger>
                <TooltipContent>{order.courierInfo.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'channel',
    header: 'Kanal',
    size: 50,
    cell: ({ row }) => <ChannelBadge channel={row.getValue('channel')} />
  },
  {
    accessorKey: 'paymentType',
    header: 'Ödeme Yöntemi',
    size: 100,
    cell: ({ row }) => <PaymentMethodBadge className='text-nowrap' paymentMethod={row.getValue('paymentType')} />
  },
  {
    accessorKey: 'totalAmount',
    header: 'Tutar (₺)',
    cell: ({ row }) => (
      <div className='text-primary-700 font-bold'>{formatCurrency(row.getValue('totalAmount'), false)}</div>
    )
  }
]

export function OrdersList({
  orders,
  isLoading,
  isFetching,
  viewMode,
  emptyMessage,
  filteredEmptyMessage,
  onViewDetails
}: OrdersListProps) {
  const { filters } = useOrders()
  const hasActiveFilter = filters.status !== 'all' || Boolean(filters.search)

  if (viewMode === 'table')
    return (
      <BasicDataTable
        columns={columns}
        data={orders ?? []}
        isLoading={isLoading || isFetching}
        emptyLabel={hasActiveFilter ? filteredEmptyMessage : emptyMessage}
        loadingLabel='Siparişler yükleniyor...'
        onRowClick={onViewDetails}
        enableColumnVisibility={false}
      />
    )

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
