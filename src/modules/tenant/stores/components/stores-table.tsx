import { AnimatedFilters } from '@/components/animated-filters'
import { BasicDataTable, BasicDataTableProps } from '@/components/basic-data-table'
import { Badge } from '@/components/ui/badge'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FilterToggleButton } from '@/components/ui/filter-card'
import { formatDateTR } from '@/lib/utils/date'
import { PaginatedResponse } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { getStoreStatusColor, getStoreStatusLabel } from '../constants'
import type { StoreListRecord } from '../types'
import { StoreDetailModal } from './stores-detail-modal'
import { type StoresFilterProperties, StoresFilters } from './stores-filters'

interface StoresTableProps {
  data: PaginatedResponse<StoreListRecord>['data']
  isLoading: boolean
  filters: StoresFilterProperties
  onFiltersChange: (f: StoresFilterProperties) => void
  onClearFilters: () => void
  onRefresh: () => void
  total: number | undefined
}

function StoreStatusBadge({ status }: { status: number }) {
  return (
    <Badge variant='outline' color={getStoreStatusColor(status)}>
      {getStoreStatusLabel(status)}
    </Badge>
  )
}

const columns: ColumnDef<StoreListRecord>[] = [
  {
    accessorKey: 'CreatedOn',
    header: 'Başvuru Tarihi',
    minSize: 120,
    cell: ({ row }) => {
      const value = row.getValue('CreatedOn') as string | undefined
      return value ? formatDateTR(value, true) : '—'
    }
  },
  {
    accessorKey: 'RestaurantName',
    header: 'Şube Adı',
    minSize: 150,
    cell: ({ row }) => <div className='ph-sensitive font-medium'>{row.getValue('RestaurantName')}</div>
  },
  {
    accessorKey: 'City',
    header: 'İl',
    minSize: 100,
    cell: ({ row }) => <div className='ph-sensitive'>{row.getValue('City') ?? '—'}</div>
  },
  {
    accessorKey: 'Status',
    header: 'Durum',
    minSize: 100,
    cell: ({ row }) => <StoreStatusBadge status={row.getValue('Status')} />
  },
  {
    id: 'actions',
    header: 'İşlemler',
    minSize: 120,
    size: 120,
    meta: { align: 'right' },
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-row items-center justify-end gap-2'>
        <StoreDetailModal storeId={row.original.RestaurantId} />
      </div>
    )
  }
]

export default function StoresTable({
  data,
  isLoading,
  filters,
  onFiltersChange,
  onClearFilters,
  onRefresh,
  total,
  ...props
}: StoresTableProps & Omit<BasicDataTableProps<StoreListRecord>, 'columns' | 'data'>) {
  const [showFilters, setShowFilters] = useState(true)

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Şubelerim ({total ?? 0})</CardTitle>
        <div className='flex flex-row items-center gap-2'>
          <RefreshButton onClick={onRefresh} isIconButton isLoading={isLoading} />
          <FilterToggleButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} color='primary' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <AnimatedFilters isOpen={showFilters}>
          <StoresFilters filters={filters} onFiltersChange={onFiltersChange} onClearFilters={onClearFilters} />
        </AnimatedFilters>
        <BasicDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyLabel='Onaylı şube kaydı bulunamadı'
          loadingLabel='Şubeler yükleniyor...'
          total={total}
          {...props}
        />
      </CardContent>
    </Card>
  )
}
