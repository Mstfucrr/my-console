import { BasicDataTable } from '@/components/basic-data-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ColumnDef } from '@tanstack/react-table'
import { STATUS_COLORS, STATUS_TEXT } from '../constants'
import type { ReportRecord } from '../types'

interface ReportsTableProps {
  data: ReportRecord[]
  isLoading: boolean
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatCurrency = (amount: number) => {
  return `₺${amount.toFixed(2)}`
}

export default function ReportsTable({ data, isLoading }: ReportsTableProps) {
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
      cell: ({ row }) => formatCurrency(row.getValue('totalAmount'))
    },
    {
      accessorKey: 'platformFee',
      header: 'Platform Komisyonu',
      cell: ({ row }) => formatCurrency(row.getValue('platformFee'))
    },
    {
      accessorKey: 'netAmount',
      header: 'Net Tutar',
      cell: ({ row }) => <div className='font-medium text-green-600'>{formatCurrency(row.getValue('netAmount'))}</div>
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
            {address}
          </div>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eski Sipariş Raporları ({data.length})</CardTitle>
      </CardHeader>
      <CardContent>
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
