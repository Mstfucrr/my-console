import { OrderStatusesGroups } from '@/types'

// Completed status groups
const COMPLETED_STATUS_GROUPS = [OrderStatusesGroups.DELIVERED, OrderStatusesGroups.CANCELLED]

// Active status groups
const ACTIVE_STATUS_GROUPS = [OrderStatusesGroups.CREATED, OrderStatusesGroups.SHIPPED]

export { ACTIVE_STATUS_GROUPS, COMPLETED_STATUS_GROUPS }
