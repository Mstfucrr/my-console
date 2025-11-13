import { AnimatedFilters } from '@/components/animated-filters'
import { BasicDataTable } from '@/components/basic-data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ColumnDef } from '@tanstack/react-table'
import { Filter, FilterX } from 'lucide-react'
import { useState } from 'react'
import { STATUS_COLORS, STATUS_TEXT } from '../constants'
import type { ReportRecord } from '../types'
import { ReportsFilters, type ReportsFilterProperties } from './reports-filters'

interface ReportsTableProps {
  data: ReportRecord[]
  isLoading: boolean
  filters: ReportsFilterProperties
  onFiltersChange: (f: ReportsFilterProperties) => void
  onClearFilters: () => void
  onRefresh: () => void
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatCurrency = (amount: number) => {
  return `₺${amount.toFixed(2)}`
}

export default function ReportsTable({
  data,
  isLoading,
  filters,
  onFiltersChange,
  onClearFilters,
  onRefresh
}: ReportsTableProps) {
  const [showFilters, setShowFilters] = useState(false)

  const columns: ColumnDef<ReportRecord>[] = [
    {
      accessorKey: 'orderId',
      header: 'Sipariş No',
      cell: ({ row }) => <div className='font-medium'>{row.getValue('orderId')}</div>
    },
    {
      accessorKey: 'customerName',
      header: 'Müşteri Adı',
      cell: ({ row }) => <div className='font-medium'>{row.getValue('customerName')}</div>
    },
    {
      accessorKey: 'customerPhone',
      header: 'Telefon',
      cell: ({ row }) => <div className='text-sm text-gray-600'>{row.getValue('customerPhone')}</div>
    },
    {
      accessorKey: 'orderDate',
      header: 'Sipariş Tarihi',
      cell: ({ row }) => formatDate(row.getValue('orderDate'))
    },
    {
      accessorKey: 'deliveryDate',
      header: 'Teslimat Tarihi',
      cell: ({ row }) => formatDate(row.getValue('deliveryDate'))
    },
    {
      accessorKey: 'totalAmount',
      header: 'Toplam Tutar',
      meta: { align: 'right' },
      cell: ({ row }) => formatCurrency(row.getValue('totalAmount'))
    },
    {
      accessorKey: 'platformFee',
      header: 'Platform Komisyonu',
      meta: { align: 'right' },
      cell: ({ row }) => formatCurrency(row.getValue('platformFee'))
    },
    {
      accessorKey: 'netAmount',
      header: 'Net Tutar',
      meta: { align: 'right' },
      cell: ({ row }) => <div className='font-medium'>{formatCurrency(row.getValue('netAmount'))}</div>
    },
    {
      accessorKey: 'status',
      header: 'Durum',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge variant='outline' className='text-nowrap' color={STATUS_COLORS[status] || 'secondary'}>
            {STATUS_TEXT[status as keyof typeof STATUS_TEXT] || status}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Ödeme Yöntemi',
      cell: ({ row }) => <div className='text-sm'>{row.getValue('paymentMethod')}</div>
    },
    {
      accessorKey: 'deliveryAddress',
      header: 'Teslimat Adresi',
      cell: ({ row }) => {
        const address = row.getValue('deliveryAddress') as string
        return (
          <div className='max-w-[200px] truncate text-sm text-gray-600' title={address}>
            {address.length > 20 ? address.slice(0, 20) + '...' : address}
          </div>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Eski Sipariş Raporları ({data.length})</CardTitle>
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
          <ReportsFilters filters={filters} onFiltersChange={onFiltersChange} onClearFilters={onClearFilters} />
        </AnimatedFilters>
        <BasicDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyLabel='Rapor kaydı bulunamadı'
          loadingLabel='Rapor kayıtları yükleniyor...'
        />
      </CardContent>
    </Card>
  )
}
