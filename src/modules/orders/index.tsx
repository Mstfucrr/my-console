/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import StatCard from '@/components/StatCard'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/loading-button'
import { OrderCard } from '@/modules/orders/components/OrderCard'
import { OrderDetailDialog } from '@/modules/orders/components/OrderDetailDialog'
import { OrderFilters } from '@/modules/orders/components/OrderFilters'
import { ordersService } from '@/modules/orders/service'
import type { FilterOptions, Order, PaginationOptions } from '@/modules/types'
import { AlertTriangle, Car, CheckCircle2, Loader2, ShoppingCart, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [filters, setFilters] = useState<FilterOptions>({})
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 10 })
  const [total, setTotal] = useState<number>(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)

  const loadOrders = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await ordersService.getOrders(filters, pagination)
      setOrders(res.data)
      setTotal(res.total)
    } catch (e) {
      setError('Siparişler yüklenemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [filters, pagination.page, pagination.limit])

  const stats = useMemo(() => {
    const totalCount = orders.length
    return {
      total: totalCount,
      delivered: orders.filter(o => o.status === 'delivered').length,
      onWay: orders.filter(o => o.status === 'on_way').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    }
  }, [orders])

  const onViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const clearFilters = () => {
    setFilters({})
    setPagination(p => ({ ...p, page: 1 }))
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <Card className='mb-6'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='mb-1 flex items-center gap-2 text-2xl'>
              <ShoppingCart className='text-amber-400' /> Siparişler
            </CardTitle>
            <p className='text-muted-foreground text-sm'>
              Tüm siparişlerinizi buradan takip edebilir ve yönetebilirsiniz
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <RefreshButton size='xs' onClick={loadOrders} isLoading={isLoading} />
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4'>
        <StatCard
          title='Toplam'
          value={stats.total}
          Icon={ShoppingCart}
          hint='Toplam sipariş sayısı'
          color='text-blue-600'
        />
        <StatCard
          title='Teslim Edildi'
          value={stats.delivered}
          Icon={CheckCircle2}
          hint='Teslim edilen siparişler'
          color='text-green-600'
        />
        <StatCard title='Yolda' value={stats.onWay} Icon={Car} hint='Yoldaki siparişler' color='text-amber-500' />
        <StatCard
          title='İptal'
          value={stats.cancelled}
          Icon={XCircle}
          hint='İptal edilen siparişler'
          color='text-red-600'
        />
      </div>

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onFiltersChange={f => {
          setFilters(f)
          setPagination(p => ({ ...p, page: 1 }))
        }}
        onClearFilters={clearFilters}
      />

      {/* Error */}
      {error && (
        <Card className='border-destructive mb-4'>
          <CardContent className='flex items-center justify-between gap-3 p-4'>
            <div className='text-destructive flex items-center gap-2'>
              <AlertTriangle className='h-4 w-4' />
              <div className='text-sm'>{error}</div>
            </div>
            <LoadingButton size='xs' onClick={loadOrders}>
              Yeniden Dene
            </LoadingButton>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Siparişler ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='text-muted-foreground flex h-48 items-center justify-center gap-2 text-sm'>
              <Loader2 className='size-5 animate-spin' /> Siparişler yükleniyor...
            </div>
          ) : orders.length === 0 ? (
            <div className='text-muted-foreground flex h-48 flex-col items-center justify-center gap-2 text-sm'>
              Kayıt bulunamadı.
              <div className='flex items-center gap-2'>
                <RefreshButton size='xs' onClick={loadOrders} isLoading={isLoading} />
                <Button size='xs' variant='outline' color='secondary' onClick={clearFilters}>
                  Filtreleri Temizle
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {orders.map(o => (
                <OrderCard key={o.id} order={o} onViewDetails={onViewDetails} />
              ))}

              {/* Pagination */}
              {total > pagination.limit && (
                <div className='mt-4 flex items-center justify-center gap-2'>
                  <Button
                    size='xs'
                    variant='outline'
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  >
                    Önceki
                  </Button>
                  <div className='text-muted-foreground text-xs'>
                    Sayfa {pagination.page} / {Math.max(1, Math.ceil(total / pagination.limit))}
                  </div>
                  <Button
                    size='xs'
                    variant='outline'
                    disabled={pagination.page >= Math.ceil(total / pagination.limit)}
                    onClick={() =>
                      setPagination(p => ({ ...p, page: Math.min(Math.ceil(total / p.limit), p.page + 1) }))
                    }
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDetailDialog order={selectedOrder} open={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
    </div>
  )
}
