import BasicDataTable from '@/components/basic-data-table'
import { Motorcycle } from '@/components/svg'
import { TooltippedElement } from '@/components/tooltipped-element'
import { MaskedText } from '@/components/ui/masked-text'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDateTimeTR } from '@/lib/utils/date'
import { maskLastName } from '@/lib/utils/mask'
import { Order } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { useOrders } from '../../context/OrdersContext'
import { ChannelBadge, OrderStatusBadge, PaymentMethodBadge } from '../Badges'

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Oluşturulma Tarihi',
    cell: ({ row }) => (
      <div className='text-muted-foreground text-sm'>
        <span className='block'>{formatDateTimeTR(row.getValue('createdAt'))}</span>
      </div>
    )
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
            <TooltippedElement tooltipContent={order.courierInfo.name} triggerProps={{ asChild: true }}>
              <Motorcycle className='text-primary -ml-1 size-4 shrink-0' />
            </TooltippedElement>
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
    cell: ({ row }) => {
      const isPrepaid = row.original.isPrepaid
      return (
        <PaymentMethodBadge
          showIcon
          IsPrepaid={isPrepaid}
          className='text-nowrap'
          paymentMethod={row.original.paymentType}
        />
      )
    }
  },
  {
    accessorKey: 'totalAmount',
    header: 'Tutar (₺)',
    cell: ({ row }) => (
      <div className='text-primary-700 font-bold'>{formatCurrency(row.getValue('totalAmount'), false)}</div>
    )
  }
]

interface TableViewProps {
  orders: Order[]
  isLoading: boolean
  isFetching: boolean
  emptyMessage: string
  filteredEmptyMessage: string
  onViewDetails: (order: Order) => void
}
export function TableView({
  orders,
  isLoading,
  isFetching,
  emptyMessage,
  filteredEmptyMessage,
  onViewDetails
}: TableViewProps) {
  const { filters } = useOrders()
  const hasActiveFilter = filters.status !== 'all' || Boolean(filters.search)

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
}
