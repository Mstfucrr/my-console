'use client'

import { AnimatedFilters } from '@/components/animated-filters'
import { Pagination } from '@/components/pagination'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TabsWithList } from '@/components/ui/tabs'
import { CheckCircle2, Flame } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ACTIVE_STATUS, COMPLETED_STATUS } from '../../constants'
import { useOrders } from '../../context/OrdersContext'
import { OrderFilters } from '../filters/OrderFilters'
import { OrdersList } from '../listing/OrdersList'
import { OrdersToolbar } from './OrdersToolbar'

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
    stats,
    statusFilter
  } = useOrders()
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [showFilters, setShowFilters] = useState(false)

  // Calculate counts based on filtered data
  const activeOrdersCount = statusFilter ? activeOrders.length : stats.created + stats.shipped
  const completedOrdersCount = statusFilter ? completedOrders.length : stats.delivered + stats.cancelled

  // Avoid type errors by using type guards and explicit checks
  const isActiveTabDisabled = Boolean(statusFilter && statusFilter.every(status => COMPLETED_STATUS.includes(status)))

  const isCompletedTabDisabled = Boolean(statusFilter && statusFilter.every(status => ACTIVE_STATUS.includes(status)))

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
            {/* Yeni Sipariş Oluştur Modalı */}

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
          <div className='space-y-4'>
            <OrdersList
              orders={activeOrders}
              isLoading={isLoadingActive}
              isFetching={isFetchingActive}
              viewMode={viewMode}
              emptyMessage='Aktif sipariş yok'
              filteredEmptyMessage='Filtreye uygun aktif sipariş yok'
            />
          </div>
        ) : (
          <div className='space-y-4'>
            <OrdersList
              orders={completedOrders}
              isLoading={isLoadingCompleted}
              isFetching={isFetchingCompleted}
              viewMode={viewMode}
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
