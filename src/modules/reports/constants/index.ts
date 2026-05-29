import { FilterOption } from '@/components/ui/filter-card'
import { OrderStatusGroup } from '@/constants/orders'
import { OrderStatusesGroups } from '@/types'

export const STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Tümü' },
  { value: OrderStatusesGroups.DELIVERED, label: OrderStatusGroup[OrderStatusesGroups.DELIVERED].label },
  { value: OrderStatusesGroups.CANCELLED, label: OrderStatusGroup[OrderStatusesGroups.CANCELLED].label }
]
