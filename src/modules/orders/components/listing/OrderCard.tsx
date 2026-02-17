'use client'

import { Motorcycle } from '@/components/svg'
import { Card, CardContent } from '@/components/ui/card'
import { MaskedText } from '@/components/ui/masked-text'
import { OrderStatusGroup } from '@/constants'
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
      data-testid='order-card'
    >
      <CardContent className='h-full p-4 max-lg:p-2.5'>
        <div className='flex h-full flex-col items-start justify-between gap-3'>
          <div className='flex w-full items-center justify-between gap-8'>
            <div className='flex items-center gap-2'>
              <ChannelBadge channel={order.channel} />
              <MaskedText
                value={order.customerName}
                maskFn={maskLastName}
                defaultMasked={true}
                textClassName='ph-sensitive text-sm font-semibold max-lg:text-xs'
                className='flex flex-row-reverse justify-end'
              />
            </div>

            <div className='text-primary-700 ph-sensitive text-lg font-bold text-nowrap max-lg:text-base'>
              {formatCurrencyTRY(order.totalAmount)}
            </div>
          </div>

          <div className='flex w-full flex-wrap items-center justify-between gap-2 text-xs'>
            <span>{formatDateTimeTR(order.createdAt)}</span>
            {order.courierInfo && (
              <div className='flex items-center gap-1'>
                <Motorcycle className='-ml-1 size-5 shrink-0' style={{ color: OrderStatusGroup['shipped'].color }} />
                <div className='ph-sensitive text-sm'>{order.courierInfo?.name}</div>
              </div>
            )}
            <div
              className={cn(
                'flex w-full flex-nowrap items-center justify-between gap-2',
                !order.courierInfo && 'w-auto! justify-end'
              )}
            >
              <OrderStatusBadge status={order.status} className='max-sm:text-[11px]' />
              <PaymentMethodBadge
                showIcon
                paymentMethod={order.paymentType}
                IsPrepaid={order.isPrepaid}
                className='max-sm:text-[11px]'
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
