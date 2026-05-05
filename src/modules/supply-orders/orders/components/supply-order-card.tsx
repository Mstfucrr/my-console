'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDateTR } from '@/lib/utils/date'
import type { SupplyOrderSummary } from '@/modules/supply-orders/create/types'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRightIcon, CheckCircle2, Package } from 'lucide-react'

interface SupplyOrderCardProps {
  order: SupplyOrderSummary
  onSelect: (orderId: string) => void
}

export function SupplyOrderCard({ order, onSelect }: SupplyOrderCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className='border-border/70 hover:border-primary/20 h-full overflow-hidden transition-all hover:shadow-md'>
        <CardContent className='space-y-4 pt-4'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0'>
              <p className='text-muted-foreground text-xs'>Sipariş No</p>
              <p className='truncate text-sm font-semibold'>{order.id}</p>
            </div>
            <div className='shrink-0'>
              {order.isPaymentReceived ? (
                <span className='inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600'>
                  <CheckCircle2 className='size-3.5' />
                  Alındı
                </span>
              ) : (
                <span className='inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600'>
                  <AlertCircle className='size-3.5' />
                  Ödeme Bekleniyor
                </span>
              )}
            </div>
          </div>
          <div className='bg-secondary/30 border-border/50 grid grid-cols-2 gap-3 rounded-xl border p-3 text-sm'>
            <div>
              <p className='text-muted-foreground text-xs'>Toplam</p>
              <p className='text-primary font-bold'>{formatCurrency(order.totalAmount)}</p>
            </div>
            <div>
              <p className='text-muted-foreground text-xs'>Tarih</p>
              <p className='font-medium'>{formatDateTR(order.orderDate, true)}</p>
            </div>
          </div>
          <div className='flex items-center justify-between gap-2'>
            <p className='text-muted-foreground flex items-center gap-1.5 text-sm'>
              <Package className='size-4' />
              <span>{order.productCount} ürün</span>
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
        </CardContent>
      </Card>
    </motion.div>
  )
}
