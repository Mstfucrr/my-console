'use client'

import { Motorcycle } from '@/components/svg'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import { cn } from '@/lib/utils'
import type { Order, OrderStatus } from '@/modules/types'
import { formatDateTR } from '../../utils'
import { ChannelBadge, PaymentMethodBadge, StatusBadge } from '../Badges'

interface OrderCardProps {
  order: Order
  onViewDetails: (order: Order) => void
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus) => void
  onCancel?: (orderId: string) => void
  showActions?: boolean
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const isUrgent = order.status === 'created'

  return (
    <Card
      className={cn('cursor-pointer transition-all hover:shadow-md', isUrgent && 'border-l-4 border-l-red-500')}
      onClick={() => onViewDetails(order)}
    >
      <CardContent className='p-4'>
        <div className='flex items-start justify-between gap-3'>
          {/* Left side - Main info */}
          <div className='flex min-w-0 flex-1 flex-col justify-between'>
            <div className='mb-2 flex items-center gap-2'>
              <ChannelBadge channel={order.channel} />
              <span className='truncate text-sm font-semibold'>{order.customerName}</span>
              {isUrgent && <span className='flex-shrink-0 animate-pulse text-red-500'>🔥</span>}
              {order.courierInfo && <Motorcycle className='text-primary -ml-2 size-8 flex-shrink-0' />}
            </div>

            <div className='text-muted-foreground mt-2 flex items-center gap-2 text-xs'>
              <span>{formatDateTR(order.createdAt)}</span>
            </div>
          </div>

          {/* Right side - Amount and action */}
          <div className='flex flex-col items-end gap-2'>
            <div className='text-warning text-lg font-bold whitespace-nowrap'>{formatCurrency(order.totalAmount)}</div>
            <div className='flex flex-wrap items-center gap-2'>
              <StatusBadge status={order.status} />
              <PaymentMethodBadge paymentMethod={order.paymentMethod} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
