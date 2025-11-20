'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import PageError from '@/components/page-error'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { cn } from '@/lib/utils'
import { BarChart2, LucideIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import StatCard from '../../components/StatCard'
import { DashboardDonut } from './components/DonutChart'

import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { ORDER_STATUS_COLORS, ORDER_STATUS_TEXT_COLORS } from '@/constants'
import { OrderStatusIcons, QuickActionIcons, StatCardIcons } from '@/constants/icons'
import { CreateOrderModal } from '../orders/components/actions/CreateOrderModal'
import { formatCurrencyTRY, formatDateTR } from '../orders/utils'
import { OrderStatus, OrderStatusColor, OrderStatusLabel } from '../types'
import QuickAction from './components/QuickAction'
import { mockDashboardStats } from './data'
import { useGetGraphs, useGetLatestOrders, useGetStats } from './hooks/useDashboard'
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
  type?: 'currency'
}

const statsList: Array<StatsList> = [
  {
    title: 'Toplam Sipariş',
    id: 'totalOrder',
    Icon: StatCardIcons.TotalOrders,
    color: 'text-blue-600'
  },
  {
    title: 'Teslim Edildi',
    id: 'deliveredOrder',
    Icon: OrderStatusIcons.delivered,
    color: ORDER_STATUS_TEXT_COLORS['delivered']
  },
  {
    title: 'Yola Çıktı',
    id: 'inProgressOrder',
    Icon: OrderStatusIcons.shipped,
    color: ORDER_STATUS_TEXT_COLORS['shipped']
  },
  {
    title: 'İptal Edildi',
    id: 'cancelOrder',
    Icon: OrderStatusIcons.cancelled,
    color: ORDER_STATUS_TEXT_COLORS['cancelled']
  }
]

export default function DashboardView() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange)
  const { data: stats, isLoading, isFetching, error, refetch } = useGetStats(dateRange)

  const {
    data: latestOrders,
    isLoading: latestOrdersLoading,
    error: latestOrdersError,
    refetch: latestOrdersRefetch
  } = useGetLatestOrders(dateRange)

  const { data: graphs, isLoading: graphsLoading, error: graphsError, refetch: graphsRefetch } = useGetGraphs(dateRange)

  const handleRefresh = () => {
    refetch()
    latestOrdersRefetch()
    graphsRefetch()
  }

  const chartData: { label: string; value: number; color: string }[] = useMemo(() => {
    return mockDashboardStats.ordersByStatus.map(s => ({
      label: OrderStatusLabel[s.status as OrderStatus],
      value: s.count,
      color: OrderStatusColor[s.status as OrderStatus]
    }))
  }, [])

  if (error || latestOrdersError || graphsError) {
    return (
      <PageError
        errorMessage='Dashboard verileri yüklenirken bir hata oluştu'
        onRefresh={handleRefresh}
        isLoading={isFetching}
        title='Dashboard Yüklenemedi'
        description='Dashboard verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )
  }

  return (
    <div className='flex flex-col gap-6 pt-6 max-sm:p-0'>
      {/* Header */}
      <PageHeader
        title='Özet bilgiler'
        description='İşletmenizin güncel durumunu takip edin'
        icon={BarChart2}
        actions={
          <div className='flex flex-col justify-center gap-2 sm:items-end'>
            <Label className='text-muted-foreground text-xs'>Tarih Aralığı</Label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder='Dönem seçin'
              enableTimeSelection={true}
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
              <CreateOrderModal
                trigger={<QuickAction Icon={QuickActionIcons.NewOrder} title='Yeni Sipariş' color='text-green-600' />}
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
            <StatCard key={stat.id} isLoading={isLoading} value={stats?.[stat.id] as number} {...stat} />
          ))}
        </div>
      </div>

      {/* Chart + Recent Orders */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {graphsLoading ? (
          <Skeleton className='h-80 w-full' />
        ) : (
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
        )}

        {latestOrdersLoading ? (
          <Skeleton className='h-80 w-full' />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Son Siparişler</CardTitle>
            </CardHeader>
            <CardContent>
              {latestOrders?.length && latestOrders?.length > 0 ? (
                <div className='flex flex-col gap-3'>
                  {latestOrders.map(order => (
                    <div key={order.id} className='flex items-center justify-between rounded-lg border p-3'>
                      <div className='flex-1'>
                        <div className='mb-1 flex items-center gap-2'>
                          <span className='font-medium'>#{order.id}</span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-1 text-xs font-medium',
                              ORDER_STATUS_COLORS[order.status]
                            )}
                          >
                            {OrderStatusLabel[order.status]}
                          </span>
                        </div>
                        <div className='text-muted-foreground text-sm'>{order.customerName}</div>
                        <div className='text-muted-foreground text-xs'>{formatDateTR(order.createdAt)}</div>
                      </div>
                      <div className='text-right'>
                        <div className='text-primary-700 font-semibold'>{formatCurrencyTRY(order.totalAmount)}</div>
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
        )}
      </div>
    </div>
  )
}
