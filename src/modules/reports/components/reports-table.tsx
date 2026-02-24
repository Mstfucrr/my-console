import { AnimatedFilters } from '@/components/animated-filters'
import { BasicDataTable, BasicDataTableProps } from '@/components/basic-data-table'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FilterToggleButton } from '@/components/ui/filter-card'
import { formatCurrencyTRY } from '@/lib/utils/currency'
import { formatDateTR } from '@/lib/utils/date'
import { OrderStatusBadge, PaymentMethodBadge } from '@/modules/orders/components/Badges'
import { OrderStatusesGroups, PaginatedResponse } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import type { ReportRecord } from '../types'
import { ReportsFilters, type ReportsFilterProperties } from './reports-filters'

interface ReportsTableProps {
  data: PaginatedResponse<ReportRecord>['data']
  isLoading: boolean
  filters: ReportsFilterProperties
  onFiltersChange: (f: ReportsFilterProperties) => void
  onClearFilters: () => void
  onRefresh: () => void
  total: number | undefined
}

const columns: ColumnDef<ReportRecord>[] = [
  {
    accessorKey: 'OrderId',
    header: 'Sipariş ID',
    enableSorting: false,
    minSize: 100,
    cell: ({ row }) => <div className='ph-sensitive text-xs'>{row.getValue('OrderId')}</div>
  },
  {
    accessorKey: 'CreatedOn',
    header: 'Oluşturulma Tarihi',
    cell: ({ row }) => formatDateTR(row.getValue('CreatedOn'), true)
  },
  {
    accessorKey: 'customer_name',
    header: 'Müşteri',
    minSize: 150,
    cell: ({ row }) => <div className='ph-sensitive font-medium'>{row.getValue('customer_name')}</div>
  },
  {
    accessorKey: 'Status',
    header: 'Durum',
    cell: ({ row }) => {
      const status = row.getValue('Status') === 1 ? OrderStatusesGroups.DELIVERED : OrderStatusesGroups.CANCELLED
      return <OrderStatusBadge status={status} />
    }
  },
  {
    accessorKey: 'Name',
    header: 'Ödeme Yöntemi',
    cell: ({ row }) => {
      const { IsPrepaid, Name: paymentMethod } = row.original
      return <PaymentMethodBadge className='text-nowrap' showIcon paymentMethod={paymentMethod} IsPrepaid={IsPrepaid} />
    }
  },
  {
    accessorKey: 'TotalAmount',
    header: 'Tutar (₺)',
    meta: { align: 'right' },
    size: 100,
    cell: ({ row }) => <span className='ph-sensitive'>{formatCurrencyTRY(row.getValue('TotalAmount'), false)}</span>
  }
]

export default function ReportsTable({
  data,
  isLoading,
  filters,
  onFiltersChange,
  onClearFilters,
  onRefresh,
  total,
  ...props
}: ReportsTableProps & Omit<BasicDataTableProps<ReportRecord>, 'columns' | 'data'>) {
  const [showFilters, setShowFilters] = useState(true)

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Tamamlanan Siparişler ({total})</CardTitle>
        <div className='flex flex-row items-center gap-2'>
          <RefreshButton onClick={onRefresh} isIconButton isLoading={isLoading} />
          <FilterToggleButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} color='primary' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <AnimatedFilters isOpen={showFilters}>
          <ReportsFilters filters={filters} onFiltersChange={onFiltersChange} onClearFilters={onClearFilters} />
        </AnimatedFilters>
        <BasicDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyLabel='Rapor kaydı bulunamadı'
          loadingLabel='Rapor kayıtları yükleniyor...'
          total={total}
          {...props}
        />
      </CardContent>
    </Card>
  )
}
