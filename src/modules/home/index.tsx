'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import PageError from '@/components/page-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon, Package } from 'lucide-react'
import StatCard from '../../components/StatCard'
import { DashboardDonut } from './components/DonutChart'

import { Skeleton } from '@/components/ui/skeleton'
import { getOperationDateRange } from '@/constants'
import { OrderStatusIcons, StatCardIcons } from '@/constants/icons'
import { ORDER_STATUS_TEXT_COLORS, OrderStatusGroup } from '@/constants/orders'
import { formatCurrencyTRY } from '@/lib/utils/currency'
import { formatDateTimeTR } from '@/lib/utils/date'
import type { OrderStatusStats } from '@/types'
import { OrderStatusesGroups } from '@/types'
import { OrderStatusBadge } from '../orders/components/Badges'
import { useGetLatestOrders, useGetStats } from './hooks/useDashboard'

type StatsList = {
  title: string
  id: keyof OrderStatusStats
  Icon: LucideIcon
  color: string
  type?: 'currency'
}

const statsList: Array<StatsList> = [
  {
    title: 'Toplam Sipariş',
    id: 'total',
    Icon: StatCardIcons.TotalOrders,
    color: 'text-blue-600'
  },
  {
    title: 'Beklemede',
    id: 'created',
    Icon: OrderStatusIcons[OrderStatusesGroups.CREATED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.CREATED]
  },
  {
    title: 'Teslim Edildi',
    id: 'delivered',
    Icon: OrderStatusIcons[OrderStatusesGroups.DELIVERED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.DELIVERED]
  },
  {
    title: 'Yola Çıktı',
    id: 'shipped',
    Icon: OrderStatusIcons[OrderStatusesGroups.SHIPPED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.SHIPPED]
  },
  {
    title: 'İptal Edildi',
    id: 'cancelled',
    Icon: OrderStatusIcons[OrderStatusesGroups.CANCELLED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.CANCELLED]
  }
]

const dateRange = {
  from: new Date(getOperationDateRange().startDate),
  to: new Date(getOperationDateRange().endDate)
}

export default function DashboardView() {
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

  const isEmptyStats = useMemo(() => !stats || stats?.total === 0, [stats])
  const chartData: { label: string; value: number; color: string }[] = useMemo(() => {
    if (isEmptyStats) return []

    const created = stats?.total
      ? stats?.total - (stats?.shipped ?? 0) - (stats?.delivered ?? 0) - (stats?.cancelled ?? 0)
      : 0
    return [
      {
        label: OrderStatusGroup[OrderStatusesGroups.DELIVERED].label,
        value: stats?.delivered ?? 0,
        color: OrderStatusGroup[OrderStatusesGroups.DELIVERED].color
      },
      {
        label: OrderStatusGroup[OrderStatusesGroups.SHIPPED].label,
        value: stats?.shipped ?? 0,
        color: OrderStatusGroup[OrderStatusesGroups.SHIPPED].color
      },
      {
        label: OrderStatusGroup[OrderStatusesGroups.CANCELLED].label,
        value: stats?.cancelled ?? 0,
        color: OrderStatusGroup[OrderStatusesGroups.CANCELLED].color
      },
      {
        label: OrderStatusGroup[OrderStatusesGroups.CREATED].label,
        value: created ?? 0,
        color: OrderStatusGroup[OrderStatusesGroups.CREATED].color
      }
    ]
  }, [isEmptyStats, stats])

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
    <div className='flex flex-col gap-6 py-6 max-sm:pt-0 max-sm:pb-6'>
      {/* Stats */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
        {statsList.map(stat => (
          <StatCard
            key={stat.id}
            className='max-sm:first:col-span-2 max-sm:first:w-1/2 max-sm:first:justify-self-center'
            isLoading={isLoading}
            value={stats?.[stat.id]}
            {...stat}
          />
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
                  <div className='mb-2 flex max-h-[300px] flex-col gap-2 overflow-y-auto'>
                    {latestOrders.map(order => (
                      <div
                        key={order.orderId}
                        className='text-muted-foreground relative flex items-center justify-between rounded-lg border p-3'
                      >
                        <div className='flex-1'>
                          <div className='text-sm font-medium'>{order.customerName}</div>
                          <div className='mt-1 text-xs'>{formatDateTimeTR(order.date)}</div>
                          <span className='text-xs font-light'>{order.orderId}</span>
                        </div>
                        <div className='flex flex-col gap-y-2 text-right'>
                          <OrderStatusBadge status={order.status} />
                          <div className='text-primary-700 font-semibold'>{formatCurrencyTRY(order.totalAmount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href='/orders' className='w-full'>
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
