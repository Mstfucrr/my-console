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
  const { activeTab, setActiveTab, activeOrders, completedOrders, total, isLoading, isFetching, filters } = useOrders()
  const { stats } = useOrdersStats()
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [showFilters, setShowFilters] = useState(true)
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

  const activeOrdersCount = useMemo(() => {
    if (!activeOrders) return 0
    return hasActiveFilter ? activeOrders.length : stats.created + stats.shipped
  }, [activeOrders, stats.created, stats.shipped, hasActiveFilter])

  const completedOrdersCount = useMemo(() => {
    if (!completedOrders) return 0
    return hasActiveFilter ? completedOrders.length : stats.delivered + stats.cancelled
  }, [completedOrders, stats.delivered, stats.cancelled, hasActiveFilter])

  const isActiveTabDisabled = filters.status !== 'all' && COMPLETED_STATUS_GROUPS.includes(filters.status)
  const isCompletedTabDisabled = filters.status !== 'all' && ACTIVE_STATUS_GROUPS.includes(filters.status)

  const tabItems = useMemo(
    () => [
      {
        value: 'active' as const,
        label: <span>Aktif ({activeOrdersCount})</span>,
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
            isLoading={isLoading}
            isFetching={isFetching}
            viewMode={viewMode}
            emptyMessage='Aktif sipariş yok'
            filteredEmptyMessage='Filtreye uygun aktif sipariş yok'
            onViewDetails={handleViewDetails}
          />
        ) : (
          <div className='space-y-4'>
            <OrdersList
              orders={completedOrders}
              isLoading={isLoading}
              isFetching={isFetching}
              viewMode={viewMode}
              emptyMessage='Tamamlanan sipariş bulunamadı'
              filteredEmptyMessage='Filtreye uygun tamamlanan sipariş yok'
              onViewDetails={handleViewDetails}
            />

            {total > completedPagination.limit && (
              <Pagination
                page={completedPagination.page}
                totalPages={Math.ceil(total / completedPagination.limit)}
                canPrev={completedPagination.page > 1}
                canNext={completedPagination.page < Math.ceil(total / completedPagination.limit)}
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
