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
import { useStoreApplicationStatusesQuery } from '../../hooks/useStoreApplicationStatusesQuery'
import { STORE_APPLICATION_STATUS_COLORS } from '../constants'
import type { StoreApplicationRecord } from '../types'
import { ApplicationsDetailModal } from './applications-detail-modal'
import { type StoreApplicationsFilterProperties, ApplicationsFilters } from './applications-filters'

interface ApplicationsTableProps {
  data: PaginatedResponse<StoreApplicationRecord>['data']
  isLoading: boolean
  filters: StoreApplicationsFilterProperties
  onFiltersChange: (f: StoreApplicationsFilterProperties) => void
  onClearFilters: () => void
  onRefresh: () => void
  total: number | undefined
}

function StoreApplicationStatusBadge({ statusCode }: { statusCode: number }) {
  const { data: statuses = [] } = useStoreApplicationStatusesQuery()
  const label = statuses.find(s => s.code === statusCode)?.value ?? String(statusCode)
  const color = STORE_APPLICATION_STATUS_COLORS[statusCode] ?? 'secondary'

  return (
    <Badge variant='outline' color={color}>
      {label}
    </Badge>
  )
}

const columns: ColumnDef<StoreApplicationRecord>[] = [
  {
    accessorKey: 'CreatedOn',
    header: 'Başvuru Tarihi',
    minSize: 120,
    cell: ({ row }) => formatDateTR(row.getValue('CreatedOn'), true)
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
    cell: ({ row }) => <div className='ph-sensitive'>{row.getValue('City')}</div>
  },
  {
    accessorKey: 'Status',
    header: 'Durum',
    minSize: 100,
    cell: ({ row }) => <StoreApplicationStatusBadge statusCode={row.getValue('Status')} />
  },
  {
    id: 'actions',
    header: 'İşlemler',
    minSize: 120,
    size: 120,
    meta: { align: 'right' },
    enableSorting: false,
    cell: ({ row }) => <ApplicationsDetailModal id={row.original.StoreApplicationId} />
  }
]

export function ApplicationsTable({
  data,
  isLoading,
  filters,
  onFiltersChange,
  onClearFilters,
  onRefresh,
  total,
  ...props
}: ApplicationsTableProps & Omit<BasicDataTableProps<StoreApplicationRecord>, 'columns' | 'data'>) {
  const [showFilters, setShowFilters] = useState(true)

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Başvurularım ({total ?? 0})</CardTitle>
        <div className='flex flex-row items-center gap-2'>
          <RefreshButton onClick={onRefresh} isIconButton isLoading={isLoading} />
          <FilterToggleButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} color='primary' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <AnimatedFilters isOpen={showFilters}>
          <ApplicationsFilters filters={filters} onFiltersChange={onFiltersChange} onClearFilters={onClearFilters} />
        </AnimatedFilters>
        <BasicDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyLabel='Başvuru kaydı bulunamadı'
          loadingLabel='Başvurular yükleniyor...'
          total={total}
          {...props}
        />
      </CardContent>
    </Card>
  )
}
