import { OrderStatusesGroups } from '@/types'

export interface OrderFilterProperties {
  status: 'all' | OrderStatusesGroups
  search?: string
}
