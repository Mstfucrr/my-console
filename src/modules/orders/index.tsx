'use client'

import PageError from '@/components/page-error'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Plus, ShoppingCart } from 'lucide-react'
import { CreateOrderModal } from './components/actions/CreateOrderModal'
import { OrderDetailDialog } from './components/listing/OrderDetailDialog'
import { OrdersStats } from './components/stats/OrdersStats'
import { OrdersTabs } from './components/stats/OrdersTabs'
import { OrdersProvider, useOrders } from './context/OrdersContext'

function OrdersViewContent() {
  const {
    // State
    selectedOrder,
    isModalVisible,
    isCreateModalVisible,
    // Error
    error,

    // Actions
    setIsCreateModalVisible,

    // Event handlers
    handleCloseModal,
    handleCreateOrderSuccess,
    refreshAllData
  } = useOrders()

  if (error) return <PageError errorMessage='Sipariş verileri yüklenirken bir hata oluştu' onRefresh={refreshAllData} />

  // Filter orders based on search and status

  return (
    <div className='flex flex-col gap-6 p-6 max-sm:p-0'>
      {/* Sayfa Başlığı */}
      <PageHeader
        title='Siparişler'
        icon={ShoppingCart}
        actions={
          <Button onClick={() => setIsCreateModalVisible(true)} size='lg' color='success'>
            <Plus className='mr-2' />
            Yeni Sipariş
          </Button>
        }
      />
      {/* İstatistik Kartları */}
      <OrdersStats />

      {/* Sipariş Tab'ları */}
      <OrdersTabs />

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

export default function OrdersView() {
  return (
    <OrdersProvider>
      <OrdersViewContent />
    </OrdersProvider>
  )
}
