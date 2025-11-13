import { BasicDataTable } from '@/components/basic-data-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import type { ColumnDef } from '@tanstack/react-table'
import { Filter, FilterX } from 'lucide-react'
import { useState } from 'react'
import type { ReconciliationFilterProperties, ReconciliationRecord } from '../types'
import { ReconciliationDetailsModal } from './reconciliation-details-modal'
import { ReconciliationFilters } from './reconciliation-filters'

interface ReconciliationTableProps {
  data: ReconciliationRecord[]
  isLoading: boolean

  filters: ReconciliationFilterProperties
  onFiltersChange: (f: ReconciliationFilterProperties) => void
  onClearFilters: () => void
  onRefresh: () => void
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData = unknown> {
    handleToggleModal?: (record: TData) => void
  }
}

const STATUS_COLORS: Record<string, BadgeProps['color']> = {
  pending: 'warning',
  problematic: 'destructive',
  approved: 'success'
} as const

const STATUS_TEXT = {
  pending: 'Beklemede',
  problematic: 'Onaylanmadı',
  approved: 'Onaylandı'
} as const

const columns: ColumnDef<ReconciliationRecord>[] = [
  {
    accessorKey: 'period',
    header: 'Mutabakat Dönemi',
    cell: ({ row }) => <span className='font-medium'>{row.getValue('period')}</span>
  },
  {
    accessorKey: 'totalOrderAmount',
    header: 'Toplam Sipariş Tutarı (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => formatCurrency(row.getValue('totalOrderAmount'), false)
  },
  {
    accessorKey: 'distributionCount',
    header: 'Dağıtım Adedi',
    meta: { align: 'right' },
    cell: ({ row }) => row.getValue('distributionCount')
  },
  {
    accessorKey: 'debtBalance',
    header: 'Borç Bakiye (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => formatCurrency(row.getValue('debtBalance'), false)
  },
  {
    accessorKey: 'creditBalance',
    header: 'Alacak Bakiye (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => formatCurrency(row.getValue('creditBalance'), false)
  },
  {
    accessorKey: 'netAmount',
    header: 'Net Tutar (₺)',
    meta: { align: 'right' },
    cell: ({ row }) => formatCurrency(row.getValue('netAmount'), false)
  },
  {
    accessorKey: 'status',
    header: 'Durum',
    size: 20,
    maxSize: 20,
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
      const handleToggleModal = table.options.meta?.handleToggleModal as
        | ((record: ReconciliationRecord) => void)
        | undefined

      return (
        <Button variant='outline' color='primary' onClick={() => handleToggleModal?.(row.original)}>
          Detay
        </Button>
      )
    }
  }
]

export default function ReconciliationTable({
  data,
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading,
  onRefresh
}: ReconciliationTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleToggleModal = (record: ReconciliationRecord): void => {
    setSelectedRecord(prev => (prev ? null : record))
  }

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Mutabakat Kayıtları ({data.length})</CardTitle>
          <div className='flex flex-row items-center gap-2'>
            <RefreshButton onClick={onRefresh} isIconButton isLoading={isLoading} />
            <Button color='primary' onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? <FilterX className='size-4' /> : <Filter className='size-4' />}
              <span className='ml-2'>{showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {showFilters && (
            <ReconciliationFilters
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClearFilters={onClearFilters}
            />
          )}
          <BasicDataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            emptyLabel='Mutabakat kaydı bulunamadı'
            loadingLabel='Mutabakat kayıtları yükleniyor...'
            meta={{ handleToggleModal }}
            enableColumnVisibility={false}
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
