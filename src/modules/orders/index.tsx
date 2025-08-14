'use client'

import StatCard from '@/components/StatCard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Order, PaginationOptions } from '@/modules/types'
import { AlertTriangle, CheckCircle2, Clock, Loader2, Plus, ShoppingCart, Truck, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CreateOrderModal } from './components/CreateOrderModal'
import { OrderCard } from './components/OrderCard'
import { OrderDetailDialog } from './components/OrderDetailDialog'
import { ordersService } from './service'

export default function OrdersView() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([])
  const [completedOrders, setCompletedOrders] = useState<Order[]>([])
  const [isLoadingActive, setIsLoadingActive] = useState(true)
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [completedPagination, setCompletedPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 6
  })
  const [completedTotal, setCompletedTotal] = useState(0)
  const [error, setError] = useState<string>('')

  // İstatistikler için state
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    onWay: 0,
    cancelled: 0
  })

  const loadActiveOrders = async () => {
    setIsLoadingActive(true)
    setError('')

    try {
      // Aktif siparişler (tamamlanan ve iptal edilen hariç)
      const activeResponse = await ordersService.getOrders(
        { status: ['pending', 'preparing', 'ready', 'picked_up', 'on_way'] },
        { page: 1, limit: 50 }
      )

      setActiveOrders(activeResponse.data.slice(0, 8)) // İlk 8 aktif siparişi göster (2x4 grid)
    } catch (err) {
      setError('Aktif siparişler yüklenirken bir hata oluştu.')
    } finally {
      setIsLoadingActive(false)
    }
  }

  const loadCompletedOrders = async () => {
    setIsLoadingCompleted(true)

    try {
      // Tamamlanan siparişler (delivered ve cancelled)
      const completedResponse = await ordersService.getOrders(
        { status: ['delivered', 'cancelled'] },
        completedPagination
      )

      setCompletedOrders(completedResponse.data)
      setCompletedTotal(completedResponse.total)
    } catch (err) {
      setError('Tamamlanan siparişler yüklenirken bir hata oluştu.')
    } finally {
      setIsLoadingCompleted(false)
    }
  }

  const loadAllStats = async () => {
    try {
      // Tüm siparişleri getir istatistikler için
      const allResponse = await ordersService.getOrders({ status: 'all' }, { page: 1, limit: 1000 })

      const allOrders = allResponse.data
      setStats({
        total: allOrders.length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        onWay: allOrders.filter(o => o.status === 'on_way').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length
      })
    } catch (err) {
      // Stats yükleneme hatası önemli değil
    }
  }

  useEffect(() => {
    loadActiveOrders()
    loadCompletedOrders()
    loadAllStats()
  }, [])

  useEffect(() => {
    loadCompletedOrders()
  }, [completedPagination])

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setSelectedOrder(null)
    setIsModalVisible(false)
  }

  const handleCompletedPageChange = (page: number) => {
    setCompletedPagination(prev => ({ ...prev, page }))
  }

  const handleCreateOrderSuccess = () => {
    loadActiveOrders() // Refresh active orders list
    loadAllStats() // Refresh stats
  }

  const refreshAllData = () => {
    loadActiveOrders()
    loadCompletedOrders()
    loadAllStats()
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Sayfa Başlığı */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='mb-1 flex items-center gap-2 text-2xl'>
              <ShoppingCart className='text-amber-400' /> Siparişler
            </CardTitle>
            <p className='text-muted-foreground text-sm'>
              Tüm siparişlerinizi buradan takip edebilir ve yönetebilirsiniz
            </p>
          </div>
          <Button onClick={() => setIsCreateModalVisible(true)} color='success'>
            <Plus className='mr-2 h-4 w-4' />
            Yeni Sipariş Ekle
          </Button>
        </CardHeader>
      </Card>

      {/* İstatistik Kartları */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
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
        <StatCard title='Yolda' value={stats.onWay} Icon={Truck} hint='Yoldaki siparişler' color='text-amber-500' />
        <StatCard
          title='İptal'
          value={stats.cancelled}
          Icon={XCircle}
          hint='İptal edilen siparişler'
          color='text-red-600'
        />
      </div>

      {/* Hata Mesajı */}
      {error && (
        <Alert className='border-destructive mb-4'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription className='flex items-center justify-between'>
            <span>{error}</span>
            <RefreshButton onClick={refreshAllData} />
          </AlertDescription>
        </Alert>
      )}

      {/* Aktif Siparişler - Üst Kısım */}
      <Card>
        <CardHeader className='rounded-t-lg bg-amber-50'>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-lg font-bold'>
              <Clock className='text-amber-500' /> İşlem Devam Eden Siparişler
            </CardTitle>
            <RefreshButton onClick={loadActiveOrders} isLoading={isLoadingActive} />
          </div>
        </CardHeader>
        <CardContent className='p-6 pt-0'>
          {isLoadingActive ? (
            <div className='flex h-48 items-center justify-center'>
              <div className='text-center'>
                <Loader2 className='text-muted-foreground mx-auto mb-4 h-12 w-12 animate-spin' />
                <p className='text-muted-foreground'>Aktif siparişler yükleniyor...</p>
              </div>
            </div>
          ) : activeOrders.length === 0 ? (
            <div className='flex h-48 items-center justify-center'>
              <div className='text-center'>
                <ShoppingCart className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                <p className='text-muted-foreground'>Aktif sipariş yok</p>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {activeOrders.map(order => (
                <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tamamlanan Siparişler - Alt Kısım */}
      <Card>
        <CardHeader className='rounded-t-lg bg-gray-50'>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-lg font-bold'>
              <CheckCircle2 className='text-green-600' /> Tamamlanan Siparişler
            </CardTitle>
            <RefreshButton size='sm' onClick={loadCompletedOrders} isLoading={isLoadingCompleted} />
          </div>
        </CardHeader>
        <CardContent className='p-6 pt-0'>
          {isLoadingCompleted ? (
            <div className='flex h-48 items-center justify-center'>
              <div className='text-center'>
                <Loader2 className='text-muted-foreground mx-auto mb-4 h-12 w-12 animate-spin' />
                <p className='text-muted-foreground'>Tamamlanan siparişler yükleniyor...</p>
              </div>
            </div>
          ) : completedOrders.length === 0 ? (
            <div className='flex h-48 items-center justify-center'>
              <div className='text-center'>
                <CheckCircle2 className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                <p className='text-muted-foreground'>Tamamlanan sipariş bulunamadı</p>
              </div>
            </div>
          ) : (
            <div className='space-y-3'>
              {completedOrders.map(order => (
                <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
              ))}

              {/* Sayfalama - Sadece tamamlanan siparişler için */}
              {completedTotal > completedPagination.limit && (
                <div className='mt-6 flex items-center justify-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={completedPagination.page === 1}
                    onClick={() => handleCompletedPageChange(completedPagination.page - 1)}
                  >
                    Önceki
                  </Button>
                  <span className='text-muted-foreground text-sm'>
                    Sayfa {completedPagination.page} / {Math.ceil(completedTotal / completedPagination.limit)}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={completedPagination.page >= Math.ceil(completedTotal / completedPagination.limit)}
                    onClick={() => handleCompletedPageChange(completedPagination.page + 1)}
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sipariş Detay Modalı */}
      <OrderDetailDialog order={selectedOrder} open={isModalVisible} onClose={handleCloseModal} />

      {/* Yeni Sipariş Oluştur Modalı */}
      <CreateOrderModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateOrderSuccess}
      />
    </div>
  )
}
