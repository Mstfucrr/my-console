export interface LatestOrder {
  orderId: string
  status: OrderStatusesGroups
  customerName: string
  date: string
  totalAmount: number
}
// Sipariş Yönetimi
export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  status: OrderStatusesGroups
  createdAt: string
  updatedAt: string
  totalAmount: number
  courierInfo?: CourierInfo
  paymentType: string
  channel: OrderChannel
  customerPosition: [number, number]
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

// Filtreleme ve Sayfalama
export interface FilterOptions {
  status?: OrderStatusesGroups | Array<OrderStatusesGroups> | 'all'
  dateFrom?: string
  dateTo?: string
  search?: string
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
