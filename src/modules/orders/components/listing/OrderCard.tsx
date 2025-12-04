'use client'

import { Motorcycle } from '@/components/svg'
import { TooltippedElement } from '@/components/tooltipped-element'
import { Card, CardContent } from '@/components/ui/card'
import { MaskedText } from '@/components/ui/masked-text'
import { cn } from '@/lib/utils'
import { formatCurrencyTRY } from '@/lib/utils/currency'
import { formatDateTimeTR } from '@/lib/utils/date'
import { maskLastName } from '@/lib/utils/mask'
import type { Order } from '@/types'
import { OrderStatusesGroups } from '@/types'
import { memo } from 'react'
import { ChannelBadge, OrderStatusBadge, PaymentMethodBadge } from '../Badges'

interface OrderCardProps {
  order: Order
  onViewDetails: (order: Order) => void
  onStatusUpdate?: (orderId: string, newStatus: OrderStatusesGroups) => void
  onCancel?: (orderId: string) => void
  showActions?: boolean
}

export const OrderCard = memo(function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const isCreated = order.status === OrderStatusesGroups.CREATED

  return (
    <Card
      className={cn('cursor-pointer transition-all hover:shadow-md', isCreated && 'border-l-4 border-l-red-500')}
      onClick={() => onViewDetails(order)}
    >
      <CardContent className='p-4'>
        <div className='flex flex-col items-start justify-between gap-3'>
          <div className='flex w-full items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <ChannelBadge channel={order.channel} />
              <MaskedText
                value={order.customerName}
                maskFn={maskLastName}
                defaultMasked={true}
                textClassName='text-sm font-semibold'
              />
              {order.courierInfo && (
                <TooltippedElement tooltipContent={order.courierInfo.name}>
                  <Motorcycle className='text-primary -ml-1 size-4 shrink-0' />
                </TooltippedElement>
              )}
            </div>

            <div className='text-primary-700 text-lg font-bold text-nowrap'>{formatCurrencyTRY(order.totalAmount)}</div>
          </div>

          <div className='flex w-full items-center justify-between gap-2 text-xs'>
            <span className=''>{formatDateTimeTR(order.createdAt)}</span>
            <div className='flex flex-wrap items-center gap-2'>
              <OrderStatusBadge status={order.status} />
              <PaymentMethodBadge showIcon paymentMethod={order.paymentType} IsPrepaid={order.isPrepaid} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
