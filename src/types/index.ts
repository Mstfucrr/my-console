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
  restaurant: Restaurant
  paymentMethod: PaymentMethod
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
  | 'manuel'

export type PaymentMethod = 'cash' | 'card' | 'online'

export interface CourierInfo {
  id: string
  name: string
  licensePlate?: string
  position: [number, number]
}

// Dashboard İstatistikleri

export interface ChartDataPoint {
  label: string
  value: number
}

export interface OrderStatusCount {
  status: OrderStatusesGroups
  count: number
  percentage: number
}

// Restoran Yönetimi
export interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  isActive: boolean
  createdAt: string
}

// Genel API Response
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
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
  page: number
  limit: number
  totalPages: number
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
