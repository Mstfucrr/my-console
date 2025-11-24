import { AnimatedFilters } from '@/components/animated-filters'
import { BasicDataTable } from '@/components/basic-data-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MONTHS } from '@/constants'
import { formatCurrency } from '@/lib/formatCurrency'
import type { ColumnDef } from '@tanstack/react-table'
import { Filter, FilterX } from 'lucide-react'
import { useState } from 'react'
import type { ReconciliationFilterProperties, ReconciliationRecord } from '../types'
import { ReconciliationConfirmStatus, STATUS_TEXT } from '../types'
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

// Helper function to convert ConfirmStatus to string for display
const getStatusDisplay = (status: ReconciliationConfirmStatus): string => {
  return STATUS_TEXT[status] || 'Bilinmeyen'
}

const getStatusColor = (status: ReconciliationConfirmStatus): BadgeProps['color'] => {
  return STATUS_COLORS[status] || 'secondary'
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
        <Badge variant='outline' color={getStatusColor(status)}>
          {getStatusDisplay(status)}
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
  const [showFilters, setShowFilters] = useState(true)

  const handleToggleModal = (record: ReconciliationRecord): void => {
    setSelectedRecord(prev => (prev ? null : record))
  }

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Kayıtlar ({data.length})</CardTitle>
          <div className='flex flex-row items-center gap-2'>
            <RefreshButton onClick={onRefresh} isIconButton isLoading={isLoading} />
            <Button color='primary' onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? <FilterX className='size-4' /> : <Filter className='size-4' />}
              <span className='ml-2'>{showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <AnimatedFilters isOpen={showFilters}>
            <ReconciliationFilters
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClearFilters={onClearFilters}
            />
          </AnimatedFilters>
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
