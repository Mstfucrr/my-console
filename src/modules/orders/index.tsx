'use client'

import PageError from '@/components/page-error'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Plus, ShoppingCart } from 'lucide-react'
import { CreateOrderModal } from './components/actions/CreateOrderModal'
import { OrdersSearch } from './components/filters/OrdersSearch'
import { OrdersStatusFilter } from './components/filters/OrdersStatusFilter'
import { OrderDetailDialog } from './components/listing/OrderDetailDialog'
import { OrdersPendingAlert } from './components/stats/OrdersPendingAlert'
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
        description='Tüm siparişlerinizi buradan takip edebilir ve yönetebilirsiniz'
        icon={ShoppingCart}
        iconColor='text-amber-400'
        actions={
          <div className='flex items-center gap-2'>
            <RefreshButton onClick={refreshAllData} />
            <Button onClick={() => setIsCreateModalVisible(true)} color='success'>
              <Plus className='mr-2 h-4 w-4' />
              Yeni Sipariş Ekle
            </Button>
          </div>
        }
      />

      {/* İstatistik Kartları */}
      <OrdersStats />

      {/* Pending Siparişler Uyarısı */}
      <OrdersPendingAlert />

      {/* Arama ve Filtre */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
        <OrdersSearch />
        <OrdersStatusFilter />
      </div>

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
