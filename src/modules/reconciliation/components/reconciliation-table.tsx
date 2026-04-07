import { BasicDataTable } from '@/components/basic-data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { ReconciliationStatus, type ReconciliationRecord } from '../types'
import { ReconciliationDetailsModal } from './reconciliation-details-modal'
import { ReconciliationFilter } from './reconciliation-filter'

interface ReconciliationTableProps {
  data: ReconciliationRecord[]
  isLoading: boolean
  sorting?: ColumnSort
  onSortingChange?: (sorting: ColumnSort) => void
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData = unknown> {
    handleOpenModal?: (page: 'approve' | 'report', record: TData) => void
  }
}

/** Şu anki ay veya bir önceki takvim ayı. */
function isWithinLastTwoMonths(record: ReconciliationRecord): boolean {
  const toMonth = (y: number, m: number) => y * 12 + m
  const now = new Date()
  const cur = toMonth(now.getFullYear(), now.getMonth() + 1)
  const row = toMonth(record.RecordYear, record.RecordMonth)
  return row === cur || row === cur - 1
}

const columns: ColumnDef<ReconciliationRecord>[] = [
  {
    accessorKey: 'period',
    header: 'Dönem',
    cell: ({ row }) => <span className='font-medium'>{row.original.period}</span>
  },
  {
    accessorKey: 'totalOrderAmount',
    header: 'Toplam Sipariş Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => <span className='ph-sensitive'>{formatCurrency(row.original.totalOrderAmount, false)}</span>
  },
  {
    accessorKey: 'distributionCount',
    header: 'Dağıtım Adedi',
    meta: { align: 'right' },
    cell: ({ row }) => <span className='ph-sensitive'>{row.original.distributionCount}</span>
  },
  {
    accessorKey: 'totalDeliveryAmount',
    header: 'Ata Express Dağıtım Fatura Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => <span className='ph-sensitive'>{formatCurrency(row.original.totalDeliveryAmount, false)}</span>
  },
  {
    accessorKey: 'totalBillAmount',
    header: 'Düzenleyeceğiniz Fatura Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => <span className='ph-sensitive'>{formatCurrency(row.original.totalBillAmount, false)}</span>
  },
  {
    accessorKey: 'totalFoodCouponAmount',
    header: "Yemek Kartı (Tahsilatı Ata'da) (₺)",
    meta: { align: 'right' },
    cell: ({ row }) => <span className='ph-sensitive'>{formatCurrency(row.original.totalFoodCouponAmount, false)}</span>
  },
  {
    accessorKey: 'totalPrePaidFoodCouponAmount',
    header: 'Yemek Kartı (Tahsilatı Firmanızda) (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => (
      <span className='ph-sensitive'>{formatCurrency(row.original.totalPrePaidFoodCouponAmount, false)}</span>
    )
  },
  {
    accessorKey: 'totalPrePaidAmount',
    header: 'Online Ödeme Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => <span className='ph-sensitive'>{formatCurrency(row.original.totalPrePaidAmount, false)}</span>
  },
  {
    accessorKey: 'restaurantPaymentAmount',
    header: 'Restoran Ödeme Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => (
      <span className='ph-sensitive'>{formatCurrency(row.original.restaurantPaymentAmount, false)}</span>
    )
  },
  {
    id: 'actions',
    header: 'İşlemler',
    minSize: 230,
    size: 230,
    meta: { align: 'right' },
    cell: ({ row, table }) => {
      const handleOpenModal = table.options.meta?.handleOpenModal as
        | ((page: 'approve' | 'report', record: ReconciliationRecord) => void)
        | undefined

      const status = row.original.status
      const canAct = isWithinLastTwoMonths(row.original)

      if (status === ReconciliationStatus.APPROVED) return <span className='text-success'>Onaylandı</span>

      const isReportable = status === ReconciliationStatus.PENDING

      if (isReportable && !canAct) return '-'

      return (
        <div className='flex flex-row items-center justify-end gap-2'>
          {status === ReconciliationStatus.FAILED && <span className='text-destructive'>Onaylanmadı</span>}
          <Button
            size='xs'
            variant='outline'
            color='success'
            onClick={() => handleOpenModal?.('approve', row.original)}
          >
            Onayla
          </Button>
          {isReportable && (
            <Button
              size='xs'
              variant='outline'
              color='destructive'
              onClick={() => handleOpenModal?.('report', row.original)}
            >
              Kontrole Gönder
            </Button>
          )}
        </div>
      )
    }
  }
]

export default function ReconciliationTable({
  data,
  isLoading,
  sorting,
  onSortingChange,
  dateRange,
  onDateRangeChange,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}: ReconciliationTableProps) {
  const [selected, setSelected] = useState<{ page: 'approve' | 'report'; record: ReconciliationRecord } | null>(null)

  const handleOpenModal = (page: 'approve' | 'report', record: ReconciliationRecord): void => {
    setSelected({ page, record })
  }

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Kayıtlar ({total ?? data.length})</CardTitle>
          <ReconciliationFilter dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <BasicDataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            emptyLabel='Mutabakat kaydı bulunamadı'
            loadingLabel='Mutabakat kayıtları yükleniyor...'
            meta={{ handleOpenModal }}
            enableColumnVisibility={false}
            sorting={sorting}
            onSortingChange={onSortingChange}
            enableMultiSort={false}
            manualSorting
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </CardContent>
      </Card>

      {selected && (
        <ReconciliationDetailsModal
          page={selected.page}
          record={selected.record}
          isOpen={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
