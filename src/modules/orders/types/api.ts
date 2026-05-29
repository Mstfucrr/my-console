// Backend API Response Types

import type { CourierInfo, Order } from '@/types'

export type OrderListItemResponse = Order

export interface OrderListResponse {
  orders: OrderListItemResponse[]
  total: number
  page: number
  limit: number
}

export type OrderDetailResponse = Order

export type CarrierInfoResponse = CourierInfo

export interface OrderStatsResponse {
  created: number
  shipped: number
  delivered: number
  cancelled: number
  total: number
}

import type { LatestOrder } from '@/types'

export type LatestOrderItemResponse = LatestOrder

export interface LatestOrdersResponse {
  orders: LatestOrderItemResponse[]
}
