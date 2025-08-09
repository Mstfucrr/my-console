'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { AlertTriangle, BarChart2, Loader2, Settings, Store } from 'lucide-react'
import { DashboardDonut } from './components/DonutChart'
import QuickAction from './components/QuickAction'
import StatCard from './components/StatCard'
import { dashboardStats } from './data'
import { dashboardService } from './service'
import type { DashboardStats } from './types'
import { statusColor, statusLabel } from './utils'

type DateRange = 'today' | 'week' | 'month'

export default function DashboardView() {
  const [dateRange, setDateRange] = useState<DateRange>('today')

  const {
    data: stats,
    isLoading,
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
            <LoadingButton color='primary' onClick={() => refetch()}>
              Yeniden Dene
            </LoadingButton>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <Card className='mb-6'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='mb-1 text-2xl'>Dashboard</CardTitle>
            <p className='text-muted-foreground text-sm'>İşletmenizin güncel durumunu takip edin</p>
          </div>
          <div className='flex items-center gap-2'>
            {(['today', 'week', 'month'] as const).map(range => (
              <Button
                key={range}
                size='xs'
                color={dateRange === range ? 'primary' : 'secondary'}
                variant={dateRange === range ? undefined : 'outline'}
                onClick={() => setDateRange(range)}
              >
                {range === 'today' ? 'Bugün' : range === 'week' ? 'Bu Hafta' : 'Bu Ay'}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {dashboardStats.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Chart + Errors */}
      <div className='mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
            <CardTitle className='text-base'>Son API Hataları</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentApiErrors.length > 0 ? (
              <div className='flex flex-col gap-3'>
                {stats.recentApiErrors.map(err => (
                  <div key={err.id} className='border-destructive/20 flex flex-col gap-1 rounded-md border p-3'>
                    <div className='flex items-center gap-2'>
                      <AlertTriangle className='text-destructive h-4 w-4' />
                      <span className='font-medium'>{err.endpoint}</span>
                    </div>
                    <div className='text-destructive text-sm'>{err.errorMessage}</div>
                    <div className='text-muted-foreground text-xs'>
                      {new Date(err.timestamp).toLocaleString('tr-TR')} - Kod: {err.statusCode}
                    </div>
                  </div>
                ))}
                <Link href='/settings/api-logs' className={cn('w-full')}>
                  <Button variant='outline' className='w-full'>
                    Tüm API Loglarını Görüntüle
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='flex h-64 flex-col items-center justify-center text-center'>
                <div className='mb-2 text-4xl'>🎉</div>
                <div className='text-muted-foreground'>Son 24 saatte API hatası yok!</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Hızlı Eylemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <QuickAction
              href='/orders'
              Icon={BarChart2}
              title='Son Siparişler'
              subtitle='Aktif siparişleri görüntüle'
              color='text-blue-600'
            />
            <QuickAction
              href='/restaurants'
              Icon={Store}
              title='Restoranlarım'
              subtitle='Şube bilgilerini kontrol et'
              color='text-green-600'
            />
            <QuickAction
              href='/settings'
              Icon={Settings}
              title='Entegrasyon'
              subtitle='API ve webhook ayarları'
              color='text-amber-500'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
