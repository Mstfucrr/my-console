import { OrderStatusesGroups, OrderStatusesValues } from '@/types'
import { OrderStatuses } from '@/constants/orders'

// Helper: Group'a göre status value'larını getir
function getStatusValuesByGroup(group: OrderStatusesGroups): number[] {
  return Object.values(OrderStatuses)
    .filter(status => status.group === group)
    .map(status => status.value)
}

// Helper: Group'a göre status value'larını getir (array)
function getStatusValuesByGroups(groups: OrderStatusesGroups[]): number[] {
  return groups.flatMap(group => getStatusValuesByGroup(group))
}

// Completed status groups
const COMPLETED_STATUS_GROUPS = [OrderStatusesGroups.DELIVERED, OrderStatusesGroups.CANCELLED]
const COMPLETED_STATUS = getStatusValuesByGroups(COMPLETED_STATUS_GROUPS)

// Active status groups
const ACTIVE_STATUS_GROUPS = [OrderStatusesGroups.CREATED, OrderStatusesGroups.SHIPPED]
const ACTIVE_STATUS = getStatusValuesByGroups(ACTIVE_STATUS_GROUPS)

export { ACTIVE_STATUS, COMPLETED_STATUS, ACTIVE_STATUS_GROUPS, COMPLETED_STATUS_GROUPS }
