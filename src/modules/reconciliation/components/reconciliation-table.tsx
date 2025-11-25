import { BasicDataTable } from '@/components/basic-data-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MONTHS } from '@/constants'
import { formatCurrency } from '@/lib/formatCurrency'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import type { ReconciliationRecord } from '../types'
import { ReconciliationConfirmStatus, STATUS_TEXT } from '../types'
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

const STATUS_COLORS: Record<ReconciliationConfirmStatus, BadgeProps['color']> = {
  [ReconciliationConfirmStatus.PENDING]: 'warning',
  [ReconciliationConfirmStatus.FAILED]: 'destructive',
  [ReconciliationConfirmStatus.APPROVED]: 'success'
} as const

// Helper function to format period
const formatPeriod = (record: ReconciliationRecord): string => {
  if (record.RecordPeriodName) {
    return record.RecordPeriodName
  }

  return `${record.RecordPeriod}. Dönem - ${MONTHS[record.RecordMonth - 1]} ${record.RecordYear}`
}

const columns: ColumnDef<ReconciliationRecord>[] = [
  {
    accessorKey: 'RecordPeriodName',
    header: 'Dönem',
    cell: ({ row }) => <span className='font-medium'>{formatPeriod(row.original)}</span>
  },
  {
    accessorKey: 'TotalAmount',
    header: 'Toplam Sipariş Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => formatCurrency(row.getValue('TotalAmount') as number, false)
  },
  {
    accessorKey: 'OrderCount',
    header: 'Dağıtım Adedi',
    meta: { align: 'right' },
    cell: ({ row }) => row.getValue('OrderCount')
  },
  {
    accessorKey: 'TotalDeliveryAmount',
    header: 'Toplam Teslimat Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => formatCurrency(row.getValue('TotalDeliveryAmount') as number, false)
  },
  {
    accessorKey: 'RestaurantPaymentAmount',
    header: 'Restoran Ödeme Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => formatCurrency(row.getValue('RestaurantPaymentAmount') as number, false)
  },
  {
    accessorKey: 'ConfirmStatus',
    header: 'Durum',
    size: 20,
    maxSize: 20,
    cell: ({ row }) => {
      const status = row.getValue('ConfirmStatus') as ReconciliationConfirmStatus
      return (
        <Badge variant='outline' color={STATUS_COLORS[status] || 'secondary'}>
          {STATUS_TEXT[status]}
        </Badge>
      )
    }
  },
  {
    id: 'actions',
    header: 'İşlemler',
    cell: ({ row, table }) => {
      const handleOpenModal = table.options.meta?.handleOpenModal as
        | ((page: 'approve' | 'report', record: ReconciliationRecord) => void)
        | undefined

      return (
        <div className='flex flex-row items-center gap-2'>
          <Button variant='outline' color='success' onClick={() => handleOpenModal?.('approve', row.original)}>
            Onayla
          </Button>
          <Button variant='outline' color='destructive' onClick={() => handleOpenModal?.('report', row.original)}>
            Kontrole Gönder
          </Button>
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
