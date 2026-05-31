'use client'

import PageError from '@/components/page-error'
import { Pagination } from '@/components/pagination'
import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useViewModeStore } from '@/store/view-mode'
import { LayoutGrid, Package, Table } from 'lucide-react'
import { useState } from 'react'
import { B2BOrdersGridSkeleton } from '../components/b2b-commerce-loading-skeletons'
import { B2BOrderCard } from './components/b2b-order-card'
import { B2BOrderDetailDialog } from './components/b2b-order-detail-dialog'
import { B2BOrdersTableView } from './components/b2b-orders-table-view'
import { useB2BOrdersQuery } from './hooks/useB2BOrdersQuery'

const viewModeButtons = [
  {
    label: 'Kart Görünümü',
    Icon: LayoutGrid,
    value: 'card' as const
  },
  {
    label: 'Tablo Görünümü',
    Icon: Table,
    value: 'table' as const
  }
]

export default function B2BCommerceOrdersView() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>()
  const { data, total, isLoading, isFetching, error, pagination, handlePageChange, handlePageSizeChange, refetch } =
    useB2BOrdersQuery()
  const { viewMode, setViewMode } = useViewModeStore()

  if (error) {
    return (
      <PageError
        title='Siparişlerim Yüklenemedi'
        description='Siparişlerim verileri yüklenirken bir sorun oluştu.'
        errorMessage='Siparişlerim verileri yüklenirken bir hata oluştu.'
        onRefresh={() => void refetch()}
        isLoading={isFetching}
      />
    )
  }

  return (
    <>
      <Card className='border-border/70 overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between bg-linear-to-r'>
          <div className='space-y-1'>
            <CardTitle>Siparişlerim {total > 0 ? `(${total})` : ''}</CardTitle>
          </div>
          <div className='flex items-center gap-2'>
            <RefreshButton onClick={refetch} isIconButton isLoading={isFetching} />
            <TooltippedElement tooltipContent='Görünüm Modunu Değiştir'>
              <ButtonGroup className='mb-0'>
                {viewModeButtons.map(({ label, Icon, value }) => (
                  <Button
                    key={value}
                    variant={viewMode === value ? null : 'soft'}
                    size='icon-sm'
                    onClick={() => setViewMode(value)}
                  >
                    <Icon className='size-4.5' />
                    <span className='sr-only'>{label}</span>
                  </Button>
                ))}
              </ButtonGroup>
            </TooltippedElement>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {viewMode === 'table' ? (
            <B2BOrdersTableView
              orders={data}
              isLoading={isLoading}
              isFetching={isFetching}
              total={total}
              page={pagination.page}
              pageSize={pagination.limit}
              onSelect={setSelectedOrderId}
            />
          ) : isLoading ? (
            <B2BOrdersGridSkeleton />
          ) : data.length === 0 ? (
            <div className='bg-secondary/20 border-border/60 rounded-xl border border-dashed py-16 text-center'>
              <div className='bg-background mx-auto mb-4 flex size-16 items-center justify-center rounded-full shadow-sm'>
                <Package className='text-muted-foreground/35 size-8' />
              </div>
              <p className='text-muted-foreground text-sm'>Henüz sipariş bulunmuyor.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {data.map(order => (
                <B2BOrderCard key={order.id} order={order} onSelect={setSelectedOrderId} />
              ))}
            </div>
          )}

          <Pagination
            page={pagination.page}
            pageSize={pagination.limit}
            total={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <B2BOrderDetailDialog orderId={selectedOrderId} onClose={() => setSelectedOrderId(undefined)} />
    </>
  )
}
