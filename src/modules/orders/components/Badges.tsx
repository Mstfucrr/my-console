'use client'

import CustomImage from '@/components/image'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ORDER_STATUS_BADGE_CLASSES, OrderStatusGroup } from '@/constants/orders'
import { cn } from '@/lib/utils'
import type { OrderChannel, OrderStatusesGroups } from '@/types'
import { Globe, Wallet } from 'lucide-react'
import { CHANNEL_IMAGES, CHANNEL_LABELS, PAYMENT_METHOD_COLORS } from '../constants'

interface StatusBadgeProps {
  status: OrderStatusesGroups
  variant?: 'outline' | 'soft'
  className?: string
}

export function OrderStatusBadge({ status, variant = 'soft', className }: StatusBadgeProps) {
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
  IsPrepaid?: boolean
}

export function PaymentMethodBadge({
  paymentMethod,
  showIcon = false,
  className,
  IsPrepaid = false // sipariş online ödeme ise true, kapıda ödeme ise false
}: PaymentMethodBadgeProps) {
  return (
    <Badge
      className={cn(
        PAYMENT_METHOD_COLORS[paymentMethod as keyof typeof PAYMENT_METHOD_COLORS] || 'bg-gray-100 text-gray-800',
        'flex max-w-max items-center gap-1',
        className
      )}
    >
      {showIcon && (IsPrepaid ? <Globe className='mr-1 h-3 w-3' /> : <Wallet className='mr-1 h-3 w-3' />)}
      {paymentMethod}
    </Badge>
  )
}

interface ChannelBadgeProps {
  channel: OrderChannel
  className?: string
  showText?: boolean
}

export function ChannelBadge({ channel, showText = false, className }: ChannelBadgeProps) {
  const channelLabel = CHANNEL_LABELS[channel] || channel
  const channelImage = CHANNEL_IMAGES[channel] || 'no-channel.png'

  return (
    <TooltipProvider>
      {showText ? (
        <div className='flex items-center gap-1'>
          <CustomImage
            src={`/images/order/channels/${channelImage}`}
            alt={channelLabel}
            height={22}
            width={channel === 'fiyuu' ? 30 : 22}
            className={className}
          />
          <span className='text-sm'>{channelLabel}</span>
        </div>
      ) : (
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
      )}
    </TooltipProvider>
  )
}
