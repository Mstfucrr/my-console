import type { BadgeProps } from '@/components/ui/badge'
import { OrderStatusLabel } from '@/modules/types'

export const STATUS_TEXT = {
  delivered: OrderStatusLabel.delivered,
  cancelled: OrderStatusLabel.cancelled
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
  { value: 'Kredi Kartı', label: 'Kredi Kartı' },
  { value: 'Nakit', label: 'Nakit' },
  { value: 'Banka Havalesi', label: 'Banka Havalesi' }
]
