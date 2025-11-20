'use client'

import PageError from '@/components/page-error'
import { OrdersStats } from './components/stats/OrdersStats'
import { OrdersTabs } from './components/stats/OrdersTabs'
import { OrdersProvider, useOrders } from './context/OrdersContext'

function OrdersViewContent() {
  const { error, refreshAllData, isFetchingActive, isFetchingCompleted } = useOrders()

  if (error)
    return (
      <PageError
        errorMessage='Sipariş verileri yüklenirken bir hata oluştu'
        onRefresh={refreshAllData}
        isLoading={isFetchingActive || isFetchingCompleted}
        title='Sipariş Verileri Yüklenemedi'
        description='Sipariş verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  return (
    <div className='flex flex-col gap-6 py-6 max-sm:p-0'>
      <OrdersStats />

      <OrdersTabs />
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
