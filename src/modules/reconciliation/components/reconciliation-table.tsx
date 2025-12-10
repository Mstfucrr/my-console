import { BasicDataTable } from '@/components/basic-data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDateTR } from '@/lib/utils/date'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { ReconciliationStatus, type ReconciliationRecord } from '../types'
import { ReconciliationDetailsModal } from './reconciliation-details-modal'

interface ReconciliationTableProps {
  data: ReconciliationRecord[]
  isLoading: boolean
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData = unknown> {
    handleOpenModal?: (page: 'approve' | 'report', record: TData) => void
  }
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
    cell: ({ row }) => formatCurrency(row.original.totalOrderAmount, false)
  },
  {
    accessorKey: 'distributionCount',
    header: 'Dağıtım Adedi',
    meta: { align: 'right' },
    cell: ({ row }) => row.original.distributionCount
  },
  {
    accessorKey: 'totalDeliveryAmount',
    header: 'Toplam Teslimat Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => formatCurrency(row.original.totalDeliveryAmount, false)
  },
  {
    accessorKey: 'restaurantPaymentAmount',
    header: 'Restoran Ödeme Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => formatCurrency(row.original.restaurantPaymentAmount, false)
  },
  {
    accessorKey: 'ConfirmDate',
    header: 'Onay Tarihi',
    cell: ({ row }) => (row.original.ConfirmDate ? formatDateTR(row.original.ConfirmDate) : '-')
  },
  {
    id: 'actions',
    header: 'İşlemler',
    size: 200,
    meta: { align: 'right' },
    cell: ({ row, table }) => {
      const handleOpenModal = table.options.meta?.handleOpenModal as
        | ((page: 'approve' | 'report', record: ReconciliationRecord) => void)
        | undefined

      const status = row.original.status

      if (status === ReconciliationStatus.APPROVED) return 'Mutabıkız'

      const isReportable = status === ReconciliationStatus.PENDING

      return (
        <div className='flex flex-row items-center justify-end gap-2'>
          {status === ReconciliationStatus.FAILED && <span className='text-destructive'>Mutabık değiliz</span>}
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

export default function ReconciliationTable({ data, isLoading }: ReconciliationTableProps) {
  const [selected, setSelected] = useState<{ page: 'approve' | 'report'; record: ReconciliationRecord } | null>(null)

  const handleOpenModal = (page: 'approve' | 'report', record: ReconciliationRecord): void => {
    setSelected({ page, record })
  }

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Kayıtlar ({data.length})</CardTitle>
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
