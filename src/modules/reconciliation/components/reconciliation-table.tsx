import { BasicDataTable } from '@/components/basic-data-table'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ColumnDef } from '@tanstack/react-table'

interface ReconciliationRecord {
  id: string
  date: string
  totalOrders: number
  totalAmount: number
  platformFee: number
  netAmount: number
  status: 'completed' | 'pending' | 'failed'
  paymentMethod: string
  settlementDate?: string
}

interface ReconciliationTableProps {
  data: ReconciliationRecord[]
  isLoading: boolean
}

const getStatusColor = (status: string): BadgeProps['color'] => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'failed':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Tamamlandı'
    case 'pending':
      return 'Beklemede'
    case 'failed':
      return 'Başarısız'
    default:
      return status
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatCurrency = (amount: number) => {
  return `₺${amount.toFixed(2)}`
}

export default function ReconciliationTable({ data, isLoading }: ReconciliationTableProps) {
  const columns: ColumnDef<ReconciliationRecord>[] = [
    {
      accessorKey: 'id',
      header: 'Mutabakat ID',
      cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>
    },
    {
      accessorKey: 'date',
      header: 'Tarih',
      cell: ({ row }) => formatDate(row.getValue('date'))
    },
    {
      accessorKey: 'totalOrders',
      header: 'Sipariş Sayısı',
      cell: ({ row }) => <div className='text-center'>{row.getValue('totalOrders')}</div>
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
          <Badge variant='outline' color={getStatusColor(status)}>
            {getStatusText(status)}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'settlementDate',
      header: 'Ödeme Tarihi',
      cell: ({ row }) => {
        const date = row.getValue('settlementDate') as string
        return date ? formatDate(date) : '-'
      }
    }
  ]

  return (
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
        />
      </CardContent>
    </Card>
  )
}
