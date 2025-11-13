import type { OrderStatus } from '@/modules/types'

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  created: 'bg-orange-100 text-orange-800',
  shipped: 'bg-amber-100 text-amber-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
} as const

const ORDER_STATUS_TEXT_COLORS: Record<OrderStatus, string> = {
  created: 'text-orange-600',
  shipped: 'text-amber-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-600'
} as const

const ORDER_STATUS_BG_COLORS: Record<OrderStatus, string> = {
  created: 'bg-orange-50',
  shipped: 'bg-amber-50',
  delivered: 'bg-green-50',
  cancelled: 'bg-red-50'
} as const

export { ORDER_STATUS_BG_COLORS, ORDER_STATUS_COLORS, ORDER_STATUS_TEXT_COLORS }
