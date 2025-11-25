import { OrderStatusGroup } from '@/constants/orders'
import { OrderStatusesGroups } from '@/types'

export const STATUS_OPTIONS = [
  { value: 'all', label: 'Durumlar' },
  { value: 'delivered', label: OrderStatusGroup[OrderStatusesGroups.DELIVERED].label },
  { value: 'cancelled', label: OrderStatusGroup[OrderStatusesGroups.CANCELLED].label }
]

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'all', label: 'Ödeme Yöntemleri' },
  { value: 'Nakit', label: 'Nakit' },
  { value: 'Kart', label: 'Kart' },
  { value: 'Online', label: 'Online' }
]
