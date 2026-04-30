'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDateTR } from '@/lib/utils/date'
import type { SupplyOrderSummary } from '@/modules/supply/create/types'
import { AlertCircle, ArrowRightIcon } from 'lucide-react'

interface MySupplyOrderCardProps {
  order: SupplyOrderSummary
  onSelect: (orderId: string) => void
}

export function MySupplyOrderCard({ order, onSelect }: MySupplyOrderCardProps) {
  return (
    <Card className='transition-all hover:shadow-md'>
      <CardContent className='space-y-3 pt-4'>
        <div className='flex items-start justify-between gap-2'>
          <p className='text-sm font-semibold'>{order.id}</p>
          {!order.isPaymentReceived && <AlertCircle className='size-4 text-amber-600' />}
        </div>
        <div className='space-y-1 text-sm'>
          <p>
            <span className='text-muted-foreground'>Toplam Tutar:</span> {formatCurrency(order.totalAmount)}
          </p>
          <p>
            <span className='text-muted-foreground'>Sipariş Tarihi:</span> {formatDateTR(order.orderDate, true)}
          </p>
          <p>
            <span className='text-muted-foreground'>Ödeme:</span> {order.isPaymentReceived ? 'Alındı' : 'Alınmadı'}
          </p>
          <div className='flex items-center justify-between gap-1'>
            <p>
              <span className='text-muted-foreground'>Ürün Adedi:</span> {order.productCount}
            </p>
            <Button
              variant='link'
              size='xs'
              className='text-primary -mt-2 items-center gap-1 p-0'
              onClick={() => onSelect(order.id)}
            >
              <span>Detay</span> <ArrowRightIcon className='size-3.5' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
