// Backend API Response Types

import { OrderStatusesGroups } from '@/types'

export interface OrderListItemResponse {
  orderId: string
  orderTime: string
  systemEntryTime: string
  departureTime?: string
  deliveryTime?: string
  totalOrderDuration?: number
  customerName: string
  products?: string
  carrierName?: string
  deliveryDateTime?: string
  status: OrderStatusesGroups
  paymentType: string
  channel: string
  totalAmount: number
}

export interface OrderListResponse {
  orders: OrderListItemResponse[]
  total: number
  page: number
  limit: number
}

export interface CarrierInfoResponse {
  name?: string
  plate?: string
  latitude?: number
  longitude?: number
}

export interface OrderDetailResponse {
  orderId: string
  customerName: string
  paymentMethod: string
  channel: string
  time: string
  lastUpdate: string
  totalAmount: number
  customerPhone: string
  deliveryAddress: string
  carrier?: CarrierInfoResponse
}

export interface OrderStatsResponse {
  totalOrder: number
  deliveredOrder: number
  inProgressOrder: number
  cancelOrder: number
}

export interface LatestOrderItemResponse {
  orderId: string
  status: OrderStatusesGroups
  customerName: string
  date: string
  totalAmount: number
}

export interface LatestOrdersResponse {
  orders: LatestOrderItemResponse[]
}
