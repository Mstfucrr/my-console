'use client'

import PageError from '@/components/page-error'
import { OrderDetailDialog } from './components/listing/OrderDetailDialog'
import { OrdersStats } from './components/stats/OrdersStats'
import { OrdersTabs } from './components/stats/OrdersTabs'
import { OrdersProvider, useOrders } from './context/OrdersContext'

function OrdersViewContent() {
  const { error, refreshAllData } = useOrders()

  if (error) return <PageError errorMessage='Sipariş verileri yüklenirken bir hata oluştu' onRefresh={refreshAllData} />

  return (
    <div className='flex flex-col gap-6 p-6 max-sm:p-0'>
      <OrdersStats />

      <OrdersTabs />

      <OrderDetailDialog />
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
