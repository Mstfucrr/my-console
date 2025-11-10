import { BasicDataTable } from '@/components/basic-data-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import type { ColumnDef, TableMeta } from '@tanstack/react-table'
import { useState } from 'react'
import type { ReconciliationRecord } from '../types'
import { ReconciliationDetailsModal } from './reconciliation-details-modal'

interface ReconciliationTableProps {
  data: ReconciliationRecord[]
  isLoading: boolean
}
declare module '@tanstack/react-table' {
  interface TableMeta<TData = unknown> {
    handleToggleModal?: (record: ReconciliationRecord) => void
  }
}

const STATUS_COLORS: Record<string, BadgeProps['color']> = {
  pending: 'warning',
  problematic: 'destructive',
  approved: 'success'
} as const

const STATUS_TEXT = {
  pending: 'Beklemede',
  problematic: 'Başarısız',
  approved: 'Onaylandı'
} as const

const columns: ColumnDef<ReconciliationRecord, TableMeta<ReconciliationRecord>>[] = [
  {
    accessorKey: 'period',
    header: 'Mutabakat Dönemi',
    cell: ({ row }) => <span className='font-medium'>{row.getValue('period')}</span>
  },
  {
    accessorKey: 'totalOrderAmount',
    header: 'Toplam Sipariş Tutarı',
    cell: ({ row }) => formatCurrency(row.getValue('totalOrderAmount'))
  },
  {
    accessorKey: 'distributionCount',
    header: 'Dağıtım Adedi',
    cell: ({ row }) => row.getValue('distributionCount')
  },
  {
    accessorKey: 'debtBalance',
    header: 'Borç Bakiye',
    cell: ({ row }) => formatCurrency(row.getValue('debtBalance'))
  },
  {
    accessorKey: 'creditBalance',
    header: 'Alacak Bakiye',
    cell: ({ row }) => formatCurrency(row.getValue('creditBalance'))
  },
  {
    accessorKey: 'netAmount',
    header: 'Net Tutar',
    cell: ({ row }) => formatCurrency(row.getValue('netAmount'))
  },
  {
    accessorKey: 'status',
    header: 'Durum',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant='outline' color={STATUS_COLORS[status] || 'secondary'}>
          {STATUS_TEXT[status as keyof typeof STATUS_TEXT] || status}
        </Badge>
      )
    }
  },
  {
    id: 'actions',
    header: 'İşlemler',
    cell: ({ row, table }) => {
      const handleToggleModal = table.options.meta?.handleToggleModal

      return (
        <Button variant='outline' color='primary' onClick={() => handleToggleModal?.(row.original)}>
          Detay
        </Button>
      )
    }
  }
]

export default function ReconciliationTable({ data, isLoading }: ReconciliationTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null)

  const handleToggleModal = (record: ReconciliationRecord): void => {
    setSelectedRecord(prev => (prev ? null : record))
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mutabakat Kayıtları ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <BasicDataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            emptyLabel='Mutabakat kaydı bulunamadı'
            loadingLabel='Mutabakat kayıtları yükleniyor...'
            meta={{ handleToggleModal }}
          />
        </CardContent>
      </Card>

      {selectedRecord && (
        <ReconciliationDetailsModal
          record={selectedRecord}
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </>
  )
}
