'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import PageError from '@/components/page-error'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { BarChart2, LucideIcon, Package } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import StatCard from '../../components/StatCard'
import { DashboardDonut } from './components/DonutChart'

import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderStatusIcons, StatCardIcons } from '@/constants/icons'
import { ORDER_STATUS_TEXT_COLORS, OrderStatusGroup } from '@/constants/orders'
import { OrderStatusesGroups } from '@/types'
import { StatusBadge } from '../orders/components/Badges'
import { formatCurrencyTRY, formatDateTR } from '../orders/utils'
import { useGetLatestOrders, useGetStats } from './hooks/useDashboard'
import type { DashboardStats } from './types'

const getOperationDateRange = () => {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0, 0, 0)
  const to = new Date(from)
  to.setDate(from.getDate() + 1)
  to.setHours(5, 0, 0, 0)
  return { from, to }
}

const defaultDateRange = {
  from: getOperationDateRange().from,
  to: getOperationDateRange().to
}

const MIN_MAX_DATE_RANGE = {
  rangeStart: new Date(new Date().setHours(5, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000),
  rangeEnd: getOperationDateRange().to
} as const

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
    Icon: OrderStatusIcons[OrderStatusesGroups.DELIVERED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.DELIVERED]
  },
  {
    title: 'Yola Çıktı',
    id: 'inProgressOrder',
    Icon: OrderStatusIcons[OrderStatusesGroups.SHIPPED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.SHIPPED]
  },
  {
    title: 'İptal Edildi',
    id: 'cancelOrder',
    Icon: OrderStatusIcons[OrderStatusesGroups.CANCELLED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.CANCELLED]
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

  const handleRefresh = () => {
    refetch()
    latestOrdersRefetch()
  }

  const chartData: { label: string; value: number; color: string }[] = useMemo(() => {
    if (!stats || (stats.deliveredOrder === 0 && stats.inProgressOrder === 0 && stats.cancelOrder === 0)) return []
    return [
      {
        label: OrderStatusGroup[OrderStatusesGroups.DELIVERED].label,
        value: stats?.deliveredOrder ?? 0,
        color: OrderStatusGroup[OrderStatusesGroups.DELIVERED].color
      },
      {
        label: OrderStatusGroup[OrderStatusesGroups.SHIPPED].label,
        value: stats?.inProgressOrder ?? 0,
        color: OrderStatusGroup[OrderStatusesGroups.SHIPPED].color
      },
      {
        label: OrderStatusGroup[OrderStatusesGroups.CANCELLED].label,
        value: stats?.cancelOrder ?? 0,
        color: OrderStatusGroup[OrderStatusesGroups.CANCELLED].color
      }
    ]
  }, [stats])

  const isDefaultDateRange = useMemo(() => JSON.stringify(dateRange) === JSON.stringify(defaultDateRange), [dateRange])

  if (error || latestOrdersError) {
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
    <div className='flex flex-col gap-6 py-6 max-sm:p-0'>
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
              defaultDateRange={defaultDateRange}
              defaultText='Bugün'
              calendarProps={{
                disabled: {
                  before: MIN_MAX_DATE_RANGE.rangeStart,
                  after: MIN_MAX_DATE_RANGE.rangeEnd
                },
                startMonth: MIN_MAX_DATE_RANGE.rangeStart,
                endMonth: MIN_MAX_DATE_RANGE.rangeEnd
              }}
              onDateRangeChange={setDateRange}
              placeholder='Dönem seçin'
              enableTimeSelection
              quickClearable
              variant={isDefaultDateRange ? 'outline' : 'soft'}
              color={isDefaultDateRange ? undefined : 'info'}
            />
          </div>
        }
      />

      {/* Stats */}
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {statsList.map(stat => (
          <StatCard key={stat.id} isLoading={isLoading} value={stats?.[stat.id] as number} {...stat} />
        ))}
      </div>

      {/* Chart + Recent Orders */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {isLoading ? (
          <Skeleton className='h-80 w-full' />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Sipariş Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className='flex h-80 items-center justify-center'>
                  <DashboardDonut data={chartData} />
                </div>
              ) : (
                <div className='flex h-80 flex-col items-center justify-center text-center'>
                  <div className='mb-2 text-4xl'>
                    <Package className='size-10' />
                  </div>
                  <div className='text-muted-foreground'>Henüz sipariş yok!</div>
                </div>
              )}
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
                <>
                  <div className='flex max-h-[300px] flex-col gap-3 overflow-y-auto'>
                    {latestOrders.map(order => (
                      <div
                        key={order.orderId}
                        className='text-muted-foreground relative flex items-center justify-between rounded-lg border p-3'
                      >
                        <div className='flex-1'>
                          <div className='text-sm font-medium'>{order.customerName}</div>
                          <div className='text-xs'>{formatDateTR(order.date)}</div>
                          <span className='text-xs font-light'>{order.orderId}</span>
                        </div>
                        <div className='flex flex-col gap-y-2 text-right'>
                          <StatusBadge status={order.status} />
                          <div className='text-primary-700 font-semibold'>{formatCurrencyTRY(order.totalAmount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href='/reports' className='w-full'>
                    <Button variant='outline' className='w-full bg-transparent'>
                      Tüm Siparişleri Görüntüle
                    </Button>
                  </Link>
                </>
              ) : (
                <div className='flex h-64 flex-col items-center justify-center text-center'>
                  <div className='mb-2 text-4xl'>
                    <Package className='size-10' />
                  </div>
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
