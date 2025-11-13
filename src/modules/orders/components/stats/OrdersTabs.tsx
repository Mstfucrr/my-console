'use client'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TabsWithList } from '@/components/ui/tabs'
import { CheckCircle2, Filter, FilterX, Flame, LayoutGrid, LayoutList } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ACTIVE_STATUS, COMPLETED_STATUS } from '../../constants'
import { useOrders } from '../../context/OrdersContext'
import { OrderFilters } from '../filters/OrderFilters'
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
    statusFilter,
    refreshAllData
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
          <div className='flex items-center justify-between'>
            <TabsWithList activeTab={activeTab} onValueChange={setActiveTab} items={tabItems} />
            <div className='flex flex-row items-center gap-2'>
              <div className='flex items-center gap-2'>
                <RefreshButton
                  onClick={refreshAllData}
                  isIconButton
                  isLoading={isFetchingActive || isFetchingCompleted}
                />
                <Button color='primary' onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? <FilterX className='size-4' /> : <Filter className='size-4' />}
                  <span className='ml-2'>{showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}</span>
                </Button>
              </div>
              <div className='flex items-center gap-4'>
                <ButtonGroup>
                  {viewModeButtons.map(({ label, Icon, value }) => (
                    <Button
                      key={value}
                      variant={viewMode === value ? null : 'outline'}
                      size='xs'
                      title={label}
                      onClick={() => setViewMode(value)}
                    >
                      <Icon className='size-4' />
                      <span className='sr-only'>{label}</span>
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {showFilters && <OrderFilters />}
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
