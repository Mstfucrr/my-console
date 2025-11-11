'use client'

import { Motorcycle } from '@/components/svg'
import { formatCurrency } from '@/lib/formatCurrency'
import { cn } from '@/lib/utils'
import type { Order } from '@/modules/types'
import { formatDateTR } from '../../utils'
import { ChannelBadge, PaymentMethodBadge, StatusBadge } from '../Badges'

interface OrderListItemProps {
  order: Order
  onViewDetails: (order: Order) => void
}

export function OrderListItem({ order, onViewDetails }: OrderListItemProps) {
  const isUrgent = order.status === 'created'

  return (
    <div
      className={cn(
        'hover:bg-muted/50 cursor-pointer rounded-2xl border-b px-4 py-3 transition-colors last:border-b-0',
        isUrgent && 'border-l-4 border-l-red-500 bg-red-50/50'
      )}
      onClick={() => onViewDetails(order)}
    >
      <div className='grid grid-cols-12 items-center gap-4'>
        {/* Customer Name - Fixed width */}
        <div className='col-span-2'>
          <span className='truncate text-sm font-medium'>{order.customerName}</span>
        </div>

        {/* Status Badge - Fixed width */}
        <div className='col-span-2 flex items-center gap-1'>
          <StatusBadge status={order.status} />
          {/* Courier Icon */}
          {order.courierInfo && <Motorcycle className='text-primary size-8 shrink-0' />}
        </div>

        {/* Channel Badge - Fixed width */}
        <div className='col-span-2'>
          <ChannelBadge channel={order.channel} />
        </div>

        {/* Payment Method Badge - Fixed width */}
        <div className='col-span-2'>
          <PaymentMethodBadge paymentMethod={order.paymentMethod} />
        </div>

        {/* Amount - Fixed width */}
        <div className='text-warning col-span-1 text-sm font-bold'>{formatCurrency(order.totalAmount)}</div>

        {/* Time - Fixed width */}
        <div className='text-muted-foreground col-span-3 hidden justify-end text-xs text-nowrap md:flex'>
          <span>{formatDateTR(order.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
