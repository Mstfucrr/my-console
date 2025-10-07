'use client'

import { Pagination } from '@/components/pagination'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, Flame } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'
import { OrdersFilterAlert } from './OrdersFilterAlert'
import { OrdersList } from './OrdersList'

export function OrdersTabs() {
  const {
    activeTab,
    setActiveTab,
    activeOrders,
    completedOrders,
    completedTotal,
    completedPagination,
    isLoadingActive,
    isFetchingActive,
    isLoadingCompleted,
    isFetchingCompleted,
    handleCompletedPageChange,
    stats
  } = useOrders()

  const activeOrdersCount = stats.created + stats.shipped
  const completedOrdersCount = stats.delivered + stats.cancelled

  return (
    <Card>
      <CardHeader className='pb-0'>
        <div className='flex items-center gap-4 border-b'>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'active'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Flame className='h-4 w-4' />
            Aktif Siparişler ({activeOrdersCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'completed'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckCircle2 className='h-4 w-4' />
            Tamamlanan ({completedOrdersCount})
          </button>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        {activeTab === 'active' ? (
          <div className='space-y-4'>
            <OrdersFilterAlert />
            <OrdersList
              orders={activeOrders}
              isLoading={isLoadingActive}
              isFetching={isFetchingActive}
              emptyMessage='Aktif sipariş yok'
              filteredEmptyMessage='Filtreye uygun aktif sipariş yok'
            />
          </div>
        ) : (
          <div className='space-y-4'>
            <OrdersFilterAlert />
            <OrdersList
              orders={completedOrders}
              isLoading={isLoadingCompleted}
              isFetching={isFetchingCompleted}
              emptyMessage='Tamamlanan sipariş bulunamadı'
              filteredEmptyMessage='Filtreye uygun tamamlanan sipariş yok'
            />

            {/* Pagination only for completed orders and when no filter is active */}
            {completedTotal > completedPagination.limit && (
              <Pagination
                page={completedPagination.page}
                totalPages={Math.ceil(completedTotal / completedPagination.limit)}
                canPrev={completedPagination.page > 1}
                canNext={completedPagination.page < Math.ceil(completedTotal / completedPagination.limit)}
                onPrev={() => handleCompletedPageChange(completedPagination.page - 1)}
                onNext={() => handleCompletedPageChange(completedPagination.page + 1)}
                onPageClick={p => handleCompletedPageChange(p)}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
