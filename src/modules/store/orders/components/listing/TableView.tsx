import BasicDataTable from '@/components/basic-data-table'
import { MaskedText } from '@/components/ui/masked-text'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDateDifferentString, formatDateTimeTR } from '@/lib/utils/date'
import { maskLastName } from '@/lib/utils/mask'
import { Order } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useOrders } from '../../context/OrdersContext'
import { ChannelBadge, OrderStatusBadge, PaymentMethodBadge } from '../Badges'

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Oluşturulma Tarihi',
    size: 200,
    cell: ({ row }) => (
      <div className='text-muted-foreground text-sm'>
        <span className='block'>{formatDateTimeTR(row.getValue('createdAt'))}</span>
      </div>
    )
  },
  {
    id: 'completionTime',
    accessorKey: 'completionTime',
    header: 'Tamamlanma Süresi',
    size: 200,
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      const updatedAt = row.original.updatedAt
      return <div className='text-sm'>{formatDateDifferentString(createdAt, updatedAt)}</div>
    }
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
        textClassName='font-medium ph-sensitive'
        className='flex flex-row-reverse justify-end'
      />
    )
  },
  {
    accessorKey: 'status',
    header: 'Durum',
    cell: ({ row }) => {
      return <OrderStatusBadge status={row.original.status} />
    }
  },
  {
    accessorKey: 'channel',
    header: 'Kanal',
    size: 50,
    cell: ({ row }) => {
      return <ChannelBadge channel={row.original.channel} />
    }
  },
  {
    accessorKey: 'courierInfo',
    header: 'Kurye',
    size: 300,
    cell: ({ row }) => {
      const courierInfo = row.original.courierInfo
      return <div className='ph-sensitive text-sm'>{courierInfo?.name ?? '-'}</div>
    }
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
    meta: { sortable: true, align: 'right' },
    cell: ({ row }) => (
      <div className='text-primary-700 ph-sensitive font-bold'>
        {formatCurrency(row.getValue('totalAmount'), false)}
      </div>
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
  const { filters, total, pagination, sorting, setSorting, activeTab } = useOrders()
  const hasActiveFilter = filters.status !== 'all' || Boolean(filters.search)

  const showCompletionTimeColumn = useMemo(() => activeTab === 'completed', [activeTab])

  return (
    <BasicDataTable
      columns={showCompletionTimeColumn ? columns : columns.filter(column => column.id !== 'completionTime')}
      data={orders ?? []}
      isLoading={isLoading || isFetching}
      emptyLabel={hasActiveFilter ? filteredEmptyMessage : emptyMessage}
      loadingLabel='Siparişler yükleniyor...'
      onRowClick={onViewDetails}
      enableColumnVisibility={false}
      sorting={sorting}
      onSortingChange={setSorting}
      total={total}
      page={pagination.page}
      pageSize={pagination.limit}
      hidePagination
      enableMultiSort={false}
      manualSorting
    />
  )
}
