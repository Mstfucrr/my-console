export interface LatestOrder {
  orderId: string
  status: OrderStatusesGroups
  customerName: string
  date: string
  totalAmount: number
}
// Sipariş Yönetimi
export interface Order {
  orderId: string
  sId?: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  customerPosition?: [number, number]
  isPrepaid: boolean
  status: OrderStatusesGroups
  createdAt: string
  updatedAt: string
  totalAmount: number
  courierInfo?: CourierInfo
  paymentType: string
  channel: OrderChannel
  customerNote?: string
  addressDirection?: string
}

export type OrderChannel =
  | 'yemeksepeti'
  | 'getir'
  | 'trendyolGo'
  | 'migrosYemek'
  | 'tiklaGelsin'
  | 'araGelsin'
  | 'fiyuu'
  | 'Console'
  | 'manuel'

export interface CourierInfo {
  id: string
  name: string
  licensePlate?: string
  position: [number, number]
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}

export type OrderStatusStats = {
  total: number
  created: number
  shipped: number
  delivered: number
  cancelled: number
}

// NEW ORDER STATUS

export enum OrderStatusesGroups {
  CREATED = 'created',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum OrderOriginalStatus {
  CREATED = 'order-created',
  ACCEPTED = 'order-accepted',
  ASSIGNED = 'order-assigned',
  SHIPPED = 'order-shipped',
  DELIVERED = 'order-delivered',
  CANCELLED = 'order-canceled'
}

// Order Status WebSocket Data Types (Backend DTO'larına göre)
// Base types to avoid repetition
interface BaseOrderDataWithCreatedAt {
  createdAt: string
}

export interface BaseOrderDataWithRider {
  riderName: string
  createdAt: string
}

// Specific types (names preserved for backward compatibility)
export type OrderCreatedData = BaseOrderDataWithCreatedAt
export type OrderAcceptedData = BaseOrderDataWithCreatedAt
export type OrderAssignedData = BaseOrderDataWithRider
export type OrderShippedData = BaseOrderDataWithRider
export type OrderDeliveredData = BaseOrderDataWithRider
export type OrderCanceledData = BaseOrderDataWithCreatedAt & {
  reason: string
}

// Union type for OrderStatusUpdate data field
export type OrderStatusUpdateData =
  | OrderCreatedData
  | OrderAcceptedData
  | OrderAssignedData
  | OrderShippedData
  | OrderDeliveredData
  | OrderCanceledData

export type PaymentMethodType = 'online' | 'offline'

export const PAYMENT_METHOD_TYPE_LABELS: Record<PaymentMethodType, string> = {
  online: 'Online',
  offline: 'Kapıda Ödeme'
} as const

export interface PaymentMethod {
  id: string
  key: string
  name: string
  order: number
  type: PaymentMethodType
}

// -- Courier Track --

export interface CourierTrackResponse {
  carrierId: string
  carrierName: string
  log: Array<{
    lat: number
    lng: number
    ts: string
  }>
}
