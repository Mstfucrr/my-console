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
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Siparişlerim ({total})</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {data.length === 0 && !isLoading ? (
            <div className='py-16 text-center'>
              <Package className='text-muted-foreground/30 mx-auto mb-4 size-16' />
              <p className='text-muted-foreground'>Henüz sipariş bulunmuyor.</p>
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
