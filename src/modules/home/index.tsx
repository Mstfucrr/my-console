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
import { BarChart2, CheckCircle, Clock, CreditCard, Loader2, Settings, ShoppingCart } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import StatCard from '../../components/StatCard'
import { DashboardDonut } from './components/DonutChart'
import { LineChart } from './components/LineChart'

import { CreateOrderModal } from '../orders/components/CreateOrderModal'
import { formatCurrencyTRY, formatDateTR } from '../orders/utils'
import QuickAction from './components/QuickAction'
import { dashboardService } from './service'
import type { DashboardStats } from './types'
import { statusColor, statusLabel } from './utils'

const defaultDateRange = { from: new Date(new Date().setDate(new Date().getDate() - 7)), to: new Date() }

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
      label: statusLabel(s.status),
      value: s.count,
      color: statusColor(s.status)
    }))
  }, [stats])

  const getChartTitle = (baseTitle: string) => {
    return baseTitle
  }

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

  const getStatusBadgeColor = (status: string) => {
    const colorMap: Record<string, string> = {
      created: 'bg-yellow-100 text-yellow-800', // Beklemede
      shipped: 'bg-orange-100 text-orange-800', // Yola Çıktı
      delivered: 'bg-green-100 text-green-800', // Teslim Edildi
      cancelled: 'bg-red-100 text-red-800' // İptal Edildi
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
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
          <div className='flex items-center gap-2'>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder='Tarih aralığı seçin'
              enableTimeSelection={true}
              onApply={() => {
                refetch()
              }}
            />
          </div>
        }
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Hızlı Eylemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            <QuickAction
              href='/orders'
              Icon={BarChart2}
              title='Son Siparişler'
              subtitle='Aktif siparişleri görüntüle'
              color='text-blue-600'
            />
            <QuickAction
              onClick={() => setIsCreateOrderModalVisible(true)}
              Icon={ShoppingCart}
              title='Yeni Sipariş Ekle'
              subtitle='Manuel sipariş oluştur'
              color='text-green-600'
            />
            <QuickAction
              href='/reconciliation'
              Icon={CheckCircle}
              title='Mutabakat İşlemleri'
              subtitle='Günlük mutabakatlar'
              color='text-orange-600'
            />
            <QuickAction
              href='/settings'
              Icon={Settings}
              title='Ayarlar'
              subtitle='API ve webhook ayarları'
              color='text-amber-500'
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-6'>
        <StatCard
          title='Toplam Sipariş'
          value={stats.todayOrders}
          Icon={ShoppingCart}
          hint='Bugün alınan sipariş sayısı'
          color='text-blue-600'
        />
        <StatCard
          title='Teslim Edildi'
          value={stats.deliveredOrders}
          Icon={CheckCircle}
          hint='Başarıyla teslim edilen'
          color='text-green-600'
        />
        <StatCard
          title='Yola Çıktı'
          value={stats.onWayOrders}
          Icon={BarChart2}
          hint='Şu anda kurye ile'
          color='text-amber-500'
        />
        <StatCard
          title='İptal Edildi'
          value={stats.cancelledOrders}
          Icon={Clock}
          hint='İptal edilen siparişler'
          color='text-red-600'
        />
        <StatCard
          title='Toplam Ciro'
          value={stats.totalRevenue}
          Icon={CreditCard}
          hint='Bugünkü toplam ciro'
          color='text-purple-600'
          type='currency'
        />
        <StatCard
          title='Tahsilat Bekleyen'
          value={stats.pendingPayments}
          Icon={Clock}
          hint='Ödeme bekleyen bakiye'
          color='text-yellow-600'
          type='currency'
        />
      </div>

      {/* Chart + Recent Orders */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Sipariş Durumu Dağılımı</CardTitle>
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
            <p className='text-muted-foreground text-sm'>En son alınan siparişler</p>
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
                          className={cn(
                            'rounded-full px-2 py-1 text-xs font-medium',
                            getStatusBadgeColor(order.status)
                          )}
                        >
                          {statusLabel(order.status)}
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
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>{getChartTitle('Sipariş Sayısı')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <LineChart data={stats.hourlyOrdersChart} title='Sipariş Sayısı' color='#2196F3' height={300} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>{getChartTitle('Ciro')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <LineChart data={stats.hourlyRevenueChart} title='Ciro (₺)' color='#FFD100' height={300} />
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
