'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDateTR } from '@/lib/utils/date'
import type { B2BOrderSummary } from '@/modules/b2b-commerce/types'
import { motion } from 'framer-motion'
import { ArrowRightIcon, CheckCircle2, Package } from 'lucide-react'

interface B2BOrderCardProps {
  order: B2BOrderSummary
  onSelect: (orderId: string) => void
}

export function B2BOrderCard({ order, onSelect }: B2BOrderCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className='border-border/70 hover:border-primary/20 h-full overflow-hidden transition-all hover:shadow-md'>
        <CardContent className='space-y-4 pt-4'>
          <div className='flex items-start justify-between gap-2'>
            <div className='shrink-0'>
              {/* {order.isPaymentReceived ? (
                <Badge color='success' variant='outline' className='border-0'>
                  <CheckCircle2 className='size-3.5' />
                  Alındı
                </Badge>
              ) : (
                <Badge color='warning' variant='outline' className='border-0'>
                  <AlertCircle className='size-3.5' />
                  Ödeme Bekleniyor
                </Badge>
              )} */}
              <Badge color='success' variant='outline' className='border-0'>
                <CheckCircle2 className='size-3.5' />
                Sipariş Alındı
              </Badge>
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
              className='text-primary h-auto items-center gap-1 p-0'
              onClick={() => onSelect(order.id)}
            >
              <span>Detaylar</span> <ArrowRightIcon className='size-3.5' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
