'use client'

import { BasicDataTable } from '@/components/basic-data-table'
import { Motorcycle } from '@/components/svg'
import { formatCurrency } from '@/lib/formatCurrency'
import { cn } from '@/lib/utils'
import type { Order } from '@/modules/types'
import type { ColumnDef } from '@tanstack/react-table'
import { useOrders } from '../../context/OrdersContext'
import { formatDateTR } from '../../utils'
import { ChannelBadge, PaymentMethodBadge, StatusBadge } from '../Badges'
import { OrderCard } from './OrderCard'

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

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'customerName',
      header: 'Müşteri',
      cell: ({ row }) => <div className='font-medium'>{row.getValue('customerName')}</div>
    },
    {
      accessorKey: 'status',
      header: 'Durum',
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className='flex items-center gap-1'>
            <StatusBadge status={order.status} />
            {order.courierInfo && <Motorcycle className='text-primary size-6 shrink-0' />}
          </div>
        )
      }
    },
    {
      accessorKey: 'channel',
      header: 'Kanal',
      cell: ({ row }) => <ChannelBadge channel={row.getValue('channel')} />
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Ödeme Yöntemi',
      cell: ({ row }) => <PaymentMethodBadge paymentMethod={row.getValue('paymentMethod')} />
    },
    {
      accessorKey: 'totalAmount',
      header: 'Tutar',
      cell: ({ row }) => <div className='text-warning font-bold'>{formatCurrency(row.getValue('totalAmount'))}</div>
    },
    {
      accessorKey: 'createdAt',
      header: 'Oluşturulma Tarihi',
      cell: ({ row }) => <div className='text-muted-foreground text-sm'>{formatDateTR(row.getValue('createdAt'))}</div>
    }
  ]

  if (viewMode === 'card') {
    if (isLoading || isFetching) {
      return (
        <div className='flex h-48 items-center justify-center'>
          <div className='text-center'>
            <p className='text-muted-foreground'>Siparişler yükleniyor...</p>
          </div>
        </div>
      )
    }

    if (orders.length === 0) {
      return (
        <div className='flex h-48 items-center justify-center'>
          <div className='text-center'>
            <p className='text-muted-foreground'>{statusFilter ? filteredEmptyMessage : emptyMessage}</p>
          </div>
        </div>
      )
    }

    return (
      <div className={cn('grid grid-cols-1 gap-4', 'md:grid-cols-3')}>
        {orders.map(order => (
          <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
        ))}
      </div>
    )
  }

  return (
    <BasicDataTable
      columns={columns}
      data={orders}
      isLoading={isLoading || isFetching}
      emptyLabel={statusFilter ? filteredEmptyMessage : emptyMessage}
      loadingLabel='Siparişler yükleniyor...'
      onRowClick={order => handleViewDetails(order)}
    />
  )
}
