'use client'

import BasicDataTable from '@/components/basic-data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDateTR } from '@/lib/utils/date'
import type { B2BOrderSummary } from '@/modules/b2b-commerce/types'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowRightIcon, CheckCircle2 } from 'lucide-react'

type B2BOrderSummaryWithAction = B2BOrderSummary & {
  onSelect?: (orderId: string) => void
}

const columns: ColumnDef<B2BOrderSummaryWithAction>[] = [
  {
    accessorKey: 'orderDate',
    header: 'Tarih',
    enableSorting: false,
    size: 220,
    cell: ({ row }) => <span className='text-sm font-medium'>{formatDateTR(row.original.orderDate, true)}</span>
  },
  {
    accessorKey: 'productCount',
    header: 'Ürün',
    enableSorting: false,
    size: 120,
    cell: ({ row }) => <span className='text-sm'>{row.original.productCount} ürün</span>
  },
  {
    accessorKey: 'isPaymentReceived',
    header: 'Ödeme Durumu',
    enableSorting: false,
    size: 180,
    cell: ({ row }) => (
      // row.original.isPaymentReceived ? (
      //   <Badge color='success' variant='outline' className='border-0'>
      //     <CheckCircle2 className='size-3.5' />
      //     Alındı
      //   </Badge>
      // ) : (
      //   <Badge color='warning' variant='outline' className='border-0'>
      //     <AlertCircle className='size-3.5' />
      //     Sipariş Alındı
      //   </Badge>
      // )

      <Badge color='success' variant='outline' className='border-0'>
        <CheckCircle2 className='size-3.5' />
        Sipariş Alındı
      </Badge>
    )
  },
  {
    accessorKey: 'totalAmount',
    header: 'Toplam',
    enableSorting: false,
    meta: { align: 'right' },
    cell: ({ row }) => <span className='text-primary font-bold'>{formatCurrency(row.original.totalAmount)}</span>
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    size: 120,
    cell: ({ row }) => (
      <Button
        variant='link'
        size='xs'
        className='text-primary h-auto items-center gap-1 p-0'
        onClick={event => {
          event.stopPropagation()
          row.original.onSelect?.(row.original.id)
        }}
      >
        <span>Detaylar</span>
        <ArrowRightIcon className='size-3.5' />
      </Button>
    )
  }
]

interface B2BOrdersTableViewProps {
  orders: B2BOrderSummary[]
  isLoading: boolean
  isFetching: boolean
  total: number
  page: number
  pageSize: number
  onSelect: (orderId: string) => void
}

export function B2BOrdersTableView({
  orders,
  isLoading,
  isFetching,
  total,
  page,
  pageSize,
  onSelect
}: B2BOrdersTableViewProps) {
  const tableData: B2BOrderSummaryWithAction[] = orders.map(order => ({ ...order, onSelect }))

  return (
    <BasicDataTable
      columns={columns}
      data={tableData}
      isLoading={isLoading || isFetching}
      emptyLabel='Henüz sipariş bulunmuyor.'
      loadingLabel='Siparişler yükleniyor...'
      onRowClick={order => onSelect(order.id)}
      enableColumnVisibility={false}
      total={total}
      page={page}
      pageSize={pageSize}
      hidePagination
    />
  )
}
