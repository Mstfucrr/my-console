'use client'

import CustomImage from '@/components/image'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ORDER_STATUS_BADGE_CLASSES, OrderStatusGroup } from '@/constants/orders'
import { cn } from '@/lib/utils'
import type { OrderChannel, OrderStatusesGroups } from '@/types'
import { CreditCard } from 'lucide-react'
import { CHANNEL_IMAGES, CHANNEL_LABELS, PAYMENT_METHOD_COLORS, PAYMENT_METHOD_LABELS } from '../utils'

interface StatusBadgeProps {
  status: OrderStatusesGroups
  variant?: 'outline' | 'soft'
  className?: string
}

export function StatusBadge({ status, variant = 'soft', className }: StatusBadgeProps) {
  const groupInfo = OrderStatusGroup[status]

  return (
    <Badge className={cn(ORDER_STATUS_BADGE_CLASSES[status], 'shrink-0', className)} variant={variant}>
      {groupInfo.label}
    </Badge>
  )
}

interface PaymentMethodBadgeProps {
  paymentMethod: string
  showIcon?: boolean
  className?: string
}

export function PaymentMethodBadge({ paymentMethod, showIcon = false, className }: PaymentMethodBadgeProps) {
  return (
    <Badge
      className={cn(
        PAYMENT_METHOD_COLORS[paymentMethod as keyof typeof PAYMENT_METHOD_COLORS] || 'bg-gray-100 text-gray-800',
        'flex max-w-max items-center gap-1',
        className
      )}
    >
      {showIcon && <CreditCard className='mr-1 h-3 w-3' />}
      {PAYMENT_METHOD_LABELS[paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || paymentMethod}
    </Badge>
  )
}

interface ChannelBadgeProps {
  channel: OrderChannel
  className?: string
}

export function ChannelBadge({ channel, className }: ChannelBadgeProps) {
  const channelLabel = CHANNEL_LABELS[channel] || channel
  const channelImage = CHANNEL_IMAGES[channel] || 'no-channel.png'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CustomImage
            src={`/images/order/channels/${channelImage}`}
            alt={channelLabel}
            height={22}
            width={channel === 'fiyuu' ? 30 : 22}
            className={className}
          />
        </TooltipTrigger>
        <TooltipContent>{channelLabel}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
