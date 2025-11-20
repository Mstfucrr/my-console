'use client'

import { AnimatedFilters } from '@/components/animated-filters'
import { Pagination } from '@/components/pagination'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TabsWithList } from '@/components/ui/tabs'
import type { Order, PaginationOptions } from '@/types'
import { CheckCircle2, Flame } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ACTIVE_STATUS_GROUPS, COMPLETED_STATUS_GROUPS } from '../constants'
import { useOrders } from '../context/OrdersContext'
import { useOrdersStats } from '../hooks/useOrdersStats'
import { OrderFilters } from './filters/OrderFilters'
import { OrderDetailDialog } from './listing/OrderDetailDialog'
import { OrdersList } from './listing/OrdersList'
import { OrdersToolbar } from './OrdersToolbar'

export function OrdersTabs() {
  const {
    activeTab,
    setActiveTab,
    activeOrders,
    completedOrders,
    completedTotal,
    isLoadingActive,
    isFetchingActive,
    isLoadingCompleted,
    isFetchingCompleted,
    filters
  } = useOrders()
  const { stats } = useOrdersStats()
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [completedPagination, setCompletedPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 6
  })

  const handleCompletedPageChange = (page: number) => {
    setCompletedPagination(prev => ({ ...prev, page }))
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleCloseModal = () => {
    setSelectedOrder(null)
  }

  const hasActiveFilter = filters.status !== 'all' || Boolean(filters.search)
  const activeOrdersCount = useMemo(
    () => (hasActiveFilter ? activeOrders.length : stats.created + stats.shipped),
    [activeOrders.length, stats.created, stats.shipped, hasActiveFilter]
  )
  const completedOrdersCount = useMemo(
    () => (hasActiveFilter ? completedOrders.length : stats.delivered + stats.cancelled),
    [completedOrders.length, stats.delivered, stats.cancelled, hasActiveFilter]
  )

  const isActiveTabDisabled = filters.status !== 'all' && COMPLETED_STATUS_GROUPS.includes(filters.status)
  const isCompletedTabDisabled = filters.status !== 'all' && ACTIVE_STATUS_GROUPS.includes(filters.status)

  const tabItems = useMemo(
    () => [
      {
        value: 'active' as const,
        label: <span>Aktif Siparişler ({activeOrdersCount})</span>,
        Icon: Flame,
        disabled: isActiveTabDisabled
      },
      {
        value: 'completed' as const,
        label: <span>Tamamlanan ({completedOrdersCount})</span>,
        Icon: CheckCircle2,
        disabled: isCompletedTabDisabled
      }
    ],
    [activeOrdersCount, completedOrdersCount, isActiveTabDisabled, isCompletedTabDisabled]
  )

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <TabsWithList activeTab={activeTab} onValueChange={setActiveTab} items={tabItems} />

            <OrdersToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <AnimatedFilters isOpen={showFilters}>
          <OrderFilters />
        </AnimatedFilters>
        {activeTab === 'active' ? (
          <OrdersList
            orders={activeOrders}
            isLoading={isLoadingActive}
            isFetching={isFetchingActive}
            viewMode={viewMode}
            emptyMessage='Aktif sipariş yok'
            filteredEmptyMessage='Filtreye uygun aktif sipariş yok'
            onViewDetails={handleViewDetails}
          />
        ) : (
          <div className='space-y-4'>
            <OrdersList
              orders={completedOrders}
              isLoading={isLoadingCompleted}
              isFetching={isFetchingCompleted}
              viewMode={viewMode}
              emptyMessage='Tamamlanan sipariş bulunamadı'
              filteredEmptyMessage='Filtreye uygun tamamlanan sipariş yok'
              onViewDetails={handleViewDetails}
            />

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
      <OrderDetailDialog order={selectedOrder} onClose={handleCloseModal} />
    </Card>
  )
}
