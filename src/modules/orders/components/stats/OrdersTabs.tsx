'use client'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, Flame, LayoutGrid, LayoutList } from 'lucide-react'
import { useState } from 'react'
import { ACTIVE_STATUS, COMPLETED_STATUS } from '../../constants'
import { useOrders } from '../../context/OrdersContext'
import { OrdersFilterAlert } from '../filters/OrdersFilterAlert'
import { OrdersList } from '../listing/OrdersList'

const viewModeButtons = [
  {
    label: 'Kart Görünümü',
    Icon: LayoutGrid,
    value: 'card' as const
  },
  {
    label: 'Liste Görünümü',
    Icon: LayoutList,
    value: 'list' as const
  }
]

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

  // Calculate counts based on filtered data
  const activeOrdersCount = statusFilter ? activeOrders.length : stats.created + stats.shipped
  const completedOrdersCount = statusFilter ? completedOrders.length : stats.delivered + stats.cancelled

  // Avoid type errors by using type guards and explicit checks
  const isActiveTabDisabled = Boolean(statusFilter && statusFilter.every(status => COMPLETED_STATUS.includes(status)))

  const isCompletedTabDisabled = Boolean(statusFilter && statusFilter.every(status => ACTIVE_STATUS.includes(status)))

  return (
    <Card>
      <CardHeader className='pb-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4 border-b'>
            <button
              onClick={() => setActiveTab('active')}
              disabled={isActiveTabDisabled}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                activeTab === 'active'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : isActiveTabDisabled
                    ? 'text-muted-foreground cursor-not-allowed opacity-50'
                    : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Flame className='h-4 w-4' />
              Aktif Siparişler ({activeOrdersCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              disabled={isCompletedTabDisabled}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : isCompletedTabDisabled
                    ? 'text-muted-foreground cursor-not-allowed opacity-50'
                    : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckCircle2 className='h-4 w-4' />
              Tamamlanan ({completedOrdersCount})
            </button>
          </div>
          <div className='flex items-center gap-4'>
            <ButtonGroup>
              {viewModeButtons.map(({ label, Icon, value }) => (
                <Button
                  key={value}
                  variant={viewMode === value ? null : 'outline'}
                  size='xs'
                  title={label}
                  disabled={viewMode === value}
                  onClick={() => setViewMode(value)}
                >
                  <Icon className='size-4' />
                  <span className='sr-only'>{label}</span>
                </Button>
              ))}
            </ButtonGroup>
          </div>
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
              viewMode={viewMode}
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
