import { Motorcycle } from '@/components/svg'
import { OrderStatusesGroups } from '@/types'
import { CheckCircle, ClockIcon, XCircle } from 'lucide-react'

const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatusesGroups, string> = {
  [OrderStatusesGroups.CREATED]: 'bg-orange-100 text-orange-800',
  [OrderStatusesGroups.SHIPPED]: 'bg-amber-100 text-amber-800',
  [OrderStatusesGroups.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatusesGroups.CANCELLED]: 'bg-red-100 text-red-800'
} as const

const ORDER_STATUS_TEXT_COLORS: Record<OrderStatusesGroups, string> = {
  [OrderStatusesGroups.CREATED]: 'text-orange-600',
  [OrderStatusesGroups.SHIPPED]: 'text-amber-600',
  [OrderStatusesGroups.DELIVERED]: 'text-green-600',
  [OrderStatusesGroups.CANCELLED]: 'text-red-600'
} as const

export const OrderStatusGroup = {
  [OrderStatusesGroups.CREATED]: {
    label: 'Beklemede',
    color: '#fb923c',
    icon: ClockIcon,
    value: 0
  },
  [OrderStatusesGroups.SHIPPED]: {
    label: 'Yola Çıktı',
    color: '#f59e0b',
    icon: Motorcycle,
    value: 3
  },
  [OrderStatusesGroups.DELIVERED]: {
    label: 'Teslim Edildi',
    color: '#16a34a',
    icon: CheckCircle,
    value: 1
  },
  [OrderStatusesGroups.CANCELLED]: {
    label: 'İptal Edildi',
    color: '#ef4444',
    icon: XCircle,
    value: 5
  }
} as const

export { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_TEXT_COLORS }
