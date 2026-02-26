'use client'

import { AnimatedFilters } from '@/components/animated-filters'
import { Pagination } from '@/components/pagination'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TabsWithList } from '@/components/ui/tabs'
import { usePosthogFeatureFlagsRefresh } from '@/modules/analytics/hooks/usePosthogFeatureFlagsRefresh'
import type { Order } from '@/types'
import { CheckCircle2, Flame } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { ACTIVE_ORDER_STATUS_GROUPS, COMPLETED_ORDER_STATUS_GROUPS } from '../constants'
import { useOrders } from '../context/OrdersContext'
import { useOrdersStats } from '../hooks/useOrdersStats'
import { OrderFilters } from './filters/OrderFilters'
import { OrdersList } from './listing/OrdersList'
import { OrdersToolbar } from './OrdersToolbar'

const OrderDetailDialog = dynamic(
  () => import('./listing/OrderDetailDialog').then(mod => ({ default: mod.OrderDetailDialog })),
  { ssr: false }
)

export function OrdersTabs() {
  const {
    activeTab,
    setActiveTab,
    activeOrders,
    completedOrders,
    total,
    isLoading,
    isFetching,
    filters,
    pagination,
    setPagination,
    onPageSizeChange
  } = useOrders()
  const { stats } = useOrdersStats()
  const [showFilters, setShowFilters] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  usePosthogFeatureFlagsRefresh(selectedOrder?.orderId)

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page })
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

  const isActiveTabDisabled = filters.status !== 'all' && COMPLETED_ORDER_STATUS_GROUPS.includes(filters.status)
  const isCompletedTabDisabled = filters.status !== 'all' && ACTIVE_ORDER_STATUS_GROUPS.includes(filters.status)

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

  const orderListProps = useMemo(() => {
    if (activeTab === 'active')
      return {
        orders: activeOrders,
        emptyMessage: 'Aktif sipariş bulunamadı',
        filteredEmptyMessage: 'Filtreye uygun aktif sipariş yok'
      }
    return {
      orders: completedOrders,
      emptyMessage: 'Tamamlanan sipariş bulunamadı',
      filteredEmptyMessage: 'Filtreye uygun tamamlanan sipariş yok'
    }
  }, [activeTab, activeOrders, completedOrders])

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <TabsWithList activeTab={activeTab} onValueChange={setActiveTab} items={tabItems} />

            <OrdersToolbar showFilters={showFilters} onToggleFilters={() => setShowFilters(!showFilters)} />
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <AnimatedFilters isOpen={showFilters}>
          <OrderFilters />
        </AnimatedFilters>
        <div className='flex flex-col gap-4'>
          <OrdersList
            orders={orderListProps.orders}
            isLoading={isLoading}
            isFetching={isFetching}
            emptyMessage={orderListProps.emptyMessage}
            filteredEmptyMessage={orderListProps.filteredEmptyMessage}
            onViewDetails={handleViewDetails}
          />

          {!isLoading && total > 0 && (
            <Pagination
              page={pagination.page}
              pageSize={pagination.limit}
              total={total}
              onPageChange={handlePageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </div>
      </CardContent>
      <OrderDetailDialog orderId={selectedOrder?.orderId} onClose={handleCloseModal} />
    </Card>
  )
}
