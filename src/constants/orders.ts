import { Motorcycle } from '@/components/svg'
import { OrderStatusesGroups, OrderStatusesValues } from '@/types'
import { CheckCircle, ClockIcon, XCircle } from 'lucide-react'

// Status value (0-10) -> Group mapping
export function getStatusGroupByValue(value: number): OrderStatusesGroups {
  const status = Object.values(OrderStatuses).find(s => s.value === value)
  return status?.group || OrderStatusesGroups.CREATED
}

// Group -> Status values array (for filtering)
export function getStatusValuesByGroup(group: OrderStatusesGroups): number[] {
  return Object.values(OrderStatuses)
    .filter(s => s.group === group)
    .map(s => s.value)
}

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
    icon: ClockIcon
  },
  [OrderStatusesGroups.SHIPPED]: {
    label: 'Yola Çıktı',
    color: '#f59e0b',
    icon: Motorcycle
  },
  [OrderStatusesGroups.DELIVERED]: {
    label: 'Teslim Edildi',
    color: '#16a34a',
    icon: CheckCircle
  },
  [OrderStatusesGroups.CANCELLED]: {
    label: 'İptal Edildi',
    color: '#ef4444',
    icon: XCircle
  }
} as const

export const OrderStatuses = {
  preparing: {
    label: 'Restoranda Hazırlanıyor',
    value: OrderStatusesValues.PREPARING,
    group: OrderStatusesGroups.CREATED
  },
  delivered: {
    label: 'Teslim Edildi',
    value: OrderStatusesValues.DELIVERED,
    group: OrderStatusesGroups.DELIVERED
  },
  not_completed: {
    label: 'Teslim Edilemedi',
    value: OrderStatusesValues.NOT_COMPLETED,
    group: OrderStatusesGroups.CANCELLED
  },
  assigned: {
    label: 'Kurye Teslim Aldi',
    value: OrderStatusesValues.ASSIGNED,
    group: OrderStatusesGroups.SHIPPED
  },
  waiting_for_carrier: {
    label: 'Kurye Ataması Bekliyor',
    value: OrderStatusesValues.WAITING_FOR_CARRIER,
    group: OrderStatusesGroups.CREATED
  },
  cancelled: {
    label: 'İptal Edildi',
    value: OrderStatusesValues.CANCELLED,
    group: OrderStatusesGroups.CANCELLED
  },
  redirected: {
    label: 'Yönlendirildi',
    value: OrderStatusesValues.REDIRECTED,
    group: OrderStatusesGroups.SHIPPED
  },
  waiting_for_redirect: {
    label: 'CC Yönlendirme Bekliyor',
    value: OrderStatusesValues.WAITING_FOR_REDIRECT,
    group: OrderStatusesGroups.CREATED
  },
  waiting_for_carrier_change: {
    label: 'Kurye Değişiklik Talebi Bekliyor',
    value: OrderStatusesValues.WAITING_FOR_CARRIER_CHANGE,
    group: OrderStatusesGroups.CREATED
  },
  waiting_for_cancel_request: {
    label: 'Sipariş İptal Talebi Yapıldı',
    value: OrderStatusesValues.WAITING_FOR_CANCEL_REQUEST,
    group: OrderStatusesGroups.CREATED
  },
  waiting_for_restaurant_approval: {
    label: 'Restoran Onayında',
    value: OrderStatusesValues.WAITING_FOR_RESTAURANT_APPROVAL,
    group: OrderStatusesGroups.CREATED
  }
} as const

export { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_TEXT_COLORS }
