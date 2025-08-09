import { Badge, type BadgeProps } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/modules/orders/types'
import { CarFrontIcon, CheckCircle2, Clock } from 'lucide-react'
import { statusLabelMap } from '../utils'

export function statusBadgeColor(status: OrderStatus): BadgeProps['color'] {
  const map: Record<OrderStatus, BadgeProps['color']> = {
    pending: 'warning',
    preparing: 'info',
    ready: 'success',
    picked_up: 'secondary',
    on_way: 'default',
    delivered: 'success',
    cancelled: 'secondary'
  }
  return map[status]
}

export function StatusIcon({ status, className }: { status: OrderStatus; className?: string }) {
  if (status === 'on_way') return <CarFrontIcon className={className ?? 'size-4 text-red-500'} />
  if (status === 'picked_up') return <CarFrontIcon className={className ?? 'size-4 text-purple-500'} />
  if (status === 'delivered' || status === 'ready')
    return <CheckCircle2 className={className ?? 'size-4 text-green-500'} />
  if (status === 'cancelled') return <Clock className={className ?? 'size-4'} />
  if (status === 'pending') return <Clock className={className ?? 'size-4 text-amber-500'} />
  if (status === 'preparing') return <Clock className={className ?? 'size-4 text-cyan-500'} />
  return <Clock className={className ?? 'size-4 text-amber-400'} />
}

export function StatusBadge({
  status,
  withIcon = true,
  className
}: {
  status: OrderStatus
  withIcon?: boolean
  className?: string
}) {
  return (
    <Badge color={statusBadgeColor(status)} variant='outline' className={cn('gap-1', className)}>
      {withIcon && <StatusIcon status={status} />}
      {statusLabelMap[status]}
    </Badge>
  )
}
