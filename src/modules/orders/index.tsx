'use client'

import { PageHeader } from '@/components/page-header'
import { Pagination } from '@/components/pagination'
import StatCard from '@/components/StatCard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Order, PaginationOptions } from '@/modules/types'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, CheckCircle2, Clock, Loader2, Plus, ShoppingCart, Truck, XCircle } from 'lucide-react'
import { useState } from 'react'
import { CreateOrderModal } from './components/CreateOrderModal'
import { OrderCard } from './components/OrderCard'
import { OrderDetailDialog } from './components/OrderDetailDialog'
import { ordersService } from './service'

export default function OrdersView() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [completedPagination, setCompletedPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 6
  })

  // Active orders query
  const {
    data: activeOrdersData,
    isLoading: isLoadingActive,
    isFetching: isFetchingActive,
    error: activeOrdersError,
    refetch: refetchActiveOrders
  } = useQuery({
    queryKey: ['activeOrders'],
    queryFn: async () => {
      const response = await ordersService.getOrders(
        { status: ['pending', 'preparing', 'ready', 'picked_up', 'on_way'] },
        { page: 1, limit: 50 }
      )
      return response.data.slice(0, 8) // İlk 8 aktif siparişi göster (2x4 grid)
    }
  })

  // Completed orders query
  const {
    data: completedOrdersData,
    isLoading: isLoadingCompleted,
    isFetching: isFetchingCompleted,
    error: completedOrdersError,
    refetch: refetchCompletedOrders
  } = useQuery({
    queryKey: ['completedOrders', completedPagination.page, completedPagination.limit],
    queryFn: async () => {
      const response = await ordersService.getOrders({ status: ['delivered', 'cancelled'] }, completedPagination)
      return response
    }
  })

  // Stats query
  const { data: statsData, error: statsError } = useQuery({
    queryKey: ['ordersStats'],
    queryFn: async () => {
      const response = await ordersService.getOrders({ status: 'all' }, { page: 1, limit: 1000 })
      const allOrders = response.data
      return {
        total: allOrders.length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        onWay: allOrders.filter(o => o.status === 'on_way').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length
      }
    }
  })

  // Extract data with fallbacks
  const activeOrders = activeOrdersData || []
  const completedOrders = completedOrdersData?.data || []
  const completedTotal = completedOrdersData?.total || 0
  const stats = statsData || { total: 0, delivered: 0, onWay: 0, cancelled: 0 }

  // Combine errors
  const error = activeOrdersError?.message || completedOrdersError?.message || statsError?.message || ''

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

  const handleCompletedPageClick = (page: number) => {
    setCompletedPagination(prev => ({ ...prev, page }))
  }

  const handleCreateOrderSuccess = () => {
    refetchActiveOrders() // Refresh active orders list
    // Stats will be automatically refetched when needed
  }

  const refreshAllData = () => {
    refetchActiveOrders()
    refetchCompletedOrders()
    // Stats will be automatically refetched when needed
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Sayfa Başlığı */}
      <PageHeader
        title='Siparişler'
        description='Tüm siparişlerinizi buradan takip edebilir ve yönetebilirsiniz'
        icon={ShoppingCart}
        iconColor='text-amber-400'
        actions={
          <Button onClick={() => setIsCreateModalVisible(true)} color='success'>
            <Plus className='mr-2 h-4 w-4' />
            Yeni Sipariş Ekle
          </Button>
        }
      />

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
            <RefreshButton onClick={refetchActiveOrders} isLoading={isFetchingActive} />
          </div>
        </CardHeader>
        <CardContent className='p-6 pt-0'>
          {isLoadingActive || isFetchingActive ? (
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
            <RefreshButton size='sm' onClick={refetchCompletedOrders} isLoading={isFetchingCompleted} />
          </div>
        </CardHeader>
        <CardContent className='p-6 pt-0'>
          {isLoadingCompleted || isFetchingCompleted ? (
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
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {completedOrders.map(order => (
                  <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
                ))}
              </div>

              {/* Sayfalama - Sadece tamamlanan siparişler için */}
              {completedTotal > completedPagination.limit && (
                <div className='mt-6'>
                  <Pagination
                    page={completedPagination.page}
                    totalPages={Math.ceil(completedTotal / completedPagination.limit)}
                    canPrev={completedPagination.page > 1}
                    canNext={completedPagination.page < Math.ceil(completedTotal / completedPagination.limit)}
                    onPrev={() => handleCompletedPageChange(completedPagination.page - 1)}
                    onNext={() => handleCompletedPageChange(completedPagination.page + 1)}
                    onPageClick={handleCompletedPageClick}
                    leftInfo={`${completedTotal} tamamlanan sipariş`}
                  />
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
