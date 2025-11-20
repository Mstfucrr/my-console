export interface LatestOrder {
  orderId: string
  status: OrderStatusEnum
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
  status: number // OrderStatusesValues
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
  status: number // OrderStatusesValues
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
  status?: number | Array<number> | 'all' // OrderStatusesValues or array of values
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

export enum OrderStatusesValues {
  PREPARING = 0,
  DELIVERED = 1,
  NOT_COMPLETED = 2,
  ASSIGNED = 3,
  WAITING_FOR_CARRIER = 4,
  CANCELLED = 5,
  REDIRECTED = 6,
  WAITING_FOR_REDIRECT = 7,
  WAITING_FOR_CARRIER_CHANGE = 8,
  WAITING_FOR_CANCEL_REQUEST = 9,
  WAITING_FOR_RESTAURANT_APPROVAL = 10
}

export const OrderStatusValuesWithName = {
  preparing: OrderStatusesValues.PREPARING,
  delivered: OrderStatusesValues.DELIVERED,
  not_completed: OrderStatusesValues.NOT_COMPLETED,
  assigned: OrderStatusesValues.ASSIGNED,
  waiting_for_carrier: OrderStatusesValues.WAITING_FOR_CARRIER,
  cancelled: OrderStatusesValues.CANCELLED,
  redirected: OrderStatusesValues.REDIRECTED,
  waiting_for_redirect: OrderStatusesValues.WAITING_FOR_REDIRECT,
  waiting_for_carrier_change: OrderStatusesValues.WAITING_FOR_CARRIER_CHANGE,
  waiting_for_cancel_request: OrderStatusesValues.WAITING_FOR_CANCEL_REQUEST,
  waiting_for_restaurant_approval: OrderStatusesValues.WAITING_FOR_RESTAURANT_APPROVAL
} as const

export type OrderStatusEnum = keyof typeof OrderStatusValuesWithName
