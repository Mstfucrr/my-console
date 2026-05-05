'use client'

import PageError from '@/components/page-error'
import { Pagination } from '@/components/pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { useState } from 'react'
import { useSupplyMyOrdersQuery } from '../create/hooks/useSupplyMyOrdersQuery'
import { MySupplyOrderCard } from './components/my-supply-order-card'
import { MySupplyOrderDetailDialog } from './components/my-supply-order-detail-dialog'

export default function MySupplyOrdersView() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>()
  const { data, total, isLoading, isFetching, error, pagination, handlePageChange, handlePageSizeChange, refetch } =
    useSupplyMyOrdersQuery()

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
        <CardHeader className='from-card to-secondary/30 flex flex-row items-center justify-between bg-linear-to-r'>
          <div className='space-y-1'>
            <CardTitle>Siparişlerim</CardTitle>
            <p className='text-muted-foreground text-xs'>{total} sipariş kaydı</p>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {data.length === 0 && !isLoading ? (
            <div className='bg-secondary/20 border-border/60 rounded-xl border border-dashed py-16 text-center'>
              <div className='bg-background mx-auto mb-4 flex size-16 items-center justify-center rounded-full shadow-sm'>
                <Package className='text-muted-foreground/35 size-8' />
              </div>
              <p className='text-muted-foreground text-sm'>Henüz sipariş bulunmuyor.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {data.map(order => (
                <MySupplyOrderCard key={order.id} order={order} onSelect={setSelectedOrderId} />
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

      <MySupplyOrderDetailDialog orderId={selectedOrderId} onClose={() => setSelectedOrderId(undefined)} />
    </>
  )
}
