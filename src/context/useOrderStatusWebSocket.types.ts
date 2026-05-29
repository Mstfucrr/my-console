import type { LatestOrder, Order, OrderOriginalStatus, OrderStatusesGroups, OrderStatusUpdateData } from '@/types'

export interface OrderStatusUpdate {
  orderId: string
  status: OrderStatusesGroups
  originalStatus?: OrderOriginalStatus
  timestamp: string
  data?: OrderStatusUpdateData
}

// Order WebSocket event map’i
export interface OrderEvents {
  'order-status-update': OrderStatusUpdate
}

export type OrdersResponse = { data: Order[]; total: number }

// Toast için bize lazım olan minimal shape
export type OrderLikeForToast = Pick<Order, 'orderId' | 'customerName'> | Pick<LatestOrder, 'orderId' | 'customerName'>
