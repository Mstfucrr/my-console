'use client'

import PageError from '@/components/page-error'
import { Pagination } from '@/components/pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { B2BOrdersGridSkeleton } from '@/modules/b2b-commerce/components/b2b-commerce-loading-skeletons'
import { Package } from 'lucide-react'
import { useState } from 'react'
import { useB2BOrdersQuery } from './hooks/useB2BOrdersQuery'
import { B2BOrderCard } from './components/b2b-order-card'
import { B2BOrderDetailDialog } from './components/b2b-order-detail-dialog'

export default function B2BCommerceOrdersView() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>()
  const { data, total, isLoading, isFetching, error, pagination, handlePageChange, handlePageSizeChange, refetch } =
    useB2BOrdersQuery()

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
            <CardTitle>Siparişlerim</CardTitle>
            {isLoading ? (
              <Skeleton className='h-3 w-32 rounded-md' />
            ) : (
              <p className='text-muted-foreground flex min-h-4 items-center text-xs'>{total} sipariş kaydı</p>
            )}
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {isLoading ? (
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
