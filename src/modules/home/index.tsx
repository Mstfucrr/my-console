'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { cn } from '@/lib/utils'
import { BarChart2, Loader2, LucideIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import StatCard from '../../components/StatCard'
import { DashboardDonut } from './components/DonutChart'
import { LineChart } from './components/LineChart'

import { Label } from '@/components/ui/label'
import { getStatusBgColor, getStatusColor, getStatusTextColor } from '@/constants'
import { OrderStatusIcons, QuickActionIcons, StatCardIcons } from '@/constants/icons'
import { CreateOrderModal } from '../orders/components/actions/CreateOrderModal'
import { formatCurrencyTRY, formatDateTR } from '../orders/utils'
import { OrderStatusColor, OrderStatusLabel } from '../types'
import QuickAction from './components/QuickAction'
import { dashboardService } from './service'
import type { DashboardStats } from './types'

const defaultDateRange = {
  from: new Date(new Date().setHours(0, 0, 0, 0)),
  to: new Date(new Date().setHours(23, 59, 59, 999))
}

type StatsList = {
  title: string
  id: keyof DashboardStats
  Icon: LucideIcon
  color: string
  bgColor: string
  type?: 'currency'
}

const statsList: Array<StatsList> = [
  {
    title: 'Toplam Sipariş',
    id: 'todayOrders',
    Icon: StatCardIcons.TotalOrders,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Teslim Edildi',
    id: 'deliveredOrders',
    Icon: OrderStatusIcons.delivered,
    color: getStatusTextColor('delivered'),
    bgColor: getStatusBgColor('delivered')
  },
  {
    title: 'Yola Çıktı',
    id: 'onWayOrders',
    Icon: OrderStatusIcons.shipped,
    color: getStatusTextColor('shipped'),
    bgColor: getStatusBgColor('shipped')
  },
  {
    title: 'İptal Edildi',
    id: 'cancelledOrders',
    Icon: OrderStatusIcons.cancelled,
    color: getStatusTextColor('cancelled'),
    bgColor: getStatusBgColor('cancelled')
  },
  {
    title: 'Toplam Ciro',
    id: 'totalRevenue',
    Icon: StatCardIcons.TotalRevenue,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    type: 'currency'
  },
  {
    title: 'Tahsilat Bekleyen',
    id: 'pendingPayments',
    Icon: StatCardIcons.PendingPayments,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    type: 'currency'
  }
]

export default function DashboardView() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange)
  const [isCreateOrderModalVisible, setIsCreateOrderModalVisible] = useState(false)

  const {
    data: stats,
    isLoading,
    isFetching,
    refetch
  } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', dateRange],
    queryFn: () => dashboardService.getStats(dateRange),
    staleTime: 60_000
  })

  const chartData = useMemo(() => {
    if (!stats) return []
    return stats.ordersByStatus.map(s => ({
      label: OrderStatusLabel[s.status],
      value: s.count,
      color: OrderStatusColor[s.status]
    }))
  }, [stats])

  if (isLoading) {
    return (
      <div className='p-6'>
        <Card>
          <CardContent className='flex h-48 items-center justify-center'>
            <div className='text-primary flex items-center justify-center gap-2 text-lg'>
              <Loader2 className='size-7 animate-spin' />
              <div className=''>Yükleniyor...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className='p-6'>
        <Card>
          <CardContent className='flex h-48 flex-col items-center justify-center gap-3'>
            <div className='text-muted-foreground text-sm'>Dashboard verileri yüklenemedi.</div>
            <RefreshButton size='xs' onClick={refetch} isLoading={isFetching} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6 p-6 max-sm:p-0'>
      {/* Header */}
      <PageHeader
        title='Özet bilgiler'
        description='İşletmenizin güncel durumunu takip edin'
        icon={BarChart2}
        iconColor='text-blue-500'
        actions={
          <div className='flex flex-col justify-center gap-2 sm:items-end'>
            <Label className='text-muted-foreground text-xs'>Tarih Aralığı</Label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder='Dönem seçin'
              enableTimeSelection={true}
              onApply={() => {
                refetch()
              }}
            />
          </div>
        }
      />

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Hızlı Eylemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-3'>
              <QuickAction href='/orders' Icon={QuickActionIcons.Orders} title='Siparişler' color='text-blue-600' />
              <QuickAction
                onClick={() => setIsCreateOrderModalVisible(true)}
                Icon={QuickActionIcons.NewOrder}
                title='Yeni Sipariş'
                color='text-green-600'
              />
              <QuickAction
                href='/reconciliation'
                Icon={QuickActionIcons.Reconciliation}
                title='Mutabakat'
                color='text-orange-600'
              />
              <QuickAction href='/reports' Icon={QuickActionIcons.Reports} title='Raporlar' color='text-purple-600' />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className='grid grid-cols-3 gap-4 max-sm:grid-cols-2'>
          {statsList.map(stat => (
            <StatCard key={stat.id} isLoading={isLoading} value={stats[stat.id] as number} {...stat} />
          ))}
        </div>
      </div>

      {/* Chart + Recent Orders */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Sipariş Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex h-80 items-center justify-center'>
              <DashboardDonut data={chartData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Son Siparişler</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className='flex flex-col gap-3'>
                {stats.recentOrders.map(order => (
                  <div key={order.id} className='flex items-center justify-between rounded-lg border p-3'>
                    <div className='flex-1'>
                      <div className='mb-1 flex items-center gap-2'>
                        <span className='font-medium'>#{order.id}</span>
                        <span
                          className={cn('rounded-full px-2 py-1 text-xs font-medium', getStatusColor(order.status))}
                        >
                          {OrderStatusLabel[order.status]}
                        </span>
                      </div>
                      <div className='text-muted-foreground text-sm'>{order.customerName}</div>
                      <div className='text-muted-foreground text-xs'>{formatDateTR(order.createdAt)}</div>
                    </div>
                    <div className='text-right'>
                      <div className='text-warning font-semibold'>{formatCurrencyTRY(order.totalAmount)}</div>
                    </div>
                  </div>
                ))}
                <Link href='/reports' className='w-full'>
                  <Button variant='outline' className='mt-2 w-full bg-transparent'>
                    Tüm Siparişleri Görüntüle
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='flex h-64 flex-col items-center justify-center text-center'>
                <div className='mb-2 text-4xl'>📦</div>
                <div className='text-muted-foreground'>Henüz sipariş yok!</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Line Charts */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Sipariş Sayısı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <LineChart data={stats.hourlyOrdersChart} color='#2196F3' height={300} yAxisLabel='Adet' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Ciro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <LineChart data={stats.hourlyRevenueChart} color='#FFD100' height={300} yAxisLabel='TL' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Ortalama Teslimat Süresi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <LineChart data={stats.averageDeliveryTimeChart} color='#10B981' height={300} yAxisLabel='Dakika' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        visible={isCreateOrderModalVisible}
        onClose={() => setIsCreateOrderModalVisible(false)}
        onSuccess={() => {
          refetch() // Dashboard'ı yenile
        }}
      />
    </div>
  )
}
