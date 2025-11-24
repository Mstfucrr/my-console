import type { BadgeProps } from '@/components/ui/badge'
import { OrderStatusGroup } from '@/constants/orders'
import { OrderStatusesGroups } from '@/types'

export const STATUS_TEXT = {
  delivered: OrderStatusGroup[OrderStatusesGroups.DELIVERED].label,
  cancelled: OrderStatusGroup[OrderStatusesGroups.CANCELLED].label
} as const

export const STATUS_COLORS: Record<string, BadgeProps['color']> = {
  delivered: 'success',
  cancelled: 'destructive'
} as const

export const STATUS_OPTIONS = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'delivered', label: STATUS_TEXT.delivered },
  { value: 'cancelled', label: STATUS_TEXT.cancelled }
]

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'all', label: 'Tüm Ödeme Yöntemleri' },
  { value: 'Nakit', label: 'Nakit' },
  { value: 'Kart', label: 'Kart' },
  { value: 'Online', label: 'Online' }
]
