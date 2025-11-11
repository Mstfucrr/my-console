// Kullanıcı ve Kimlik Doğrulama
export interface User {
  id: string
  email: string
  name: string
  companyName: string
  role: string
  needsOnboarding?: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// Sipariş Yönetimi
export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  status: OrderStatus
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

export type OrderStatus =
  | 'created' // Beklemede
  | 'shipped' // Yola Çıktı
  | 'delivered' // Teslim Edildi
  | 'cancelled' // İptal Edildi

export const OrderStatusLabel = {
  created: 'Beklemede',
  shipped: 'Yola Çıktı',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi'
} as const

export const OrderStatusColor = {
  created: '#fb923c', // Beklemede - Orange
  shipped: '#f59e0b', // Yola Çıktı - Amber
  delivered: '#16a34a', // Teslim Edildi - Green
  cancelled: '#ef4444' // İptal Edildi - Red
} as const
// Dashboard İstatistikleri
export interface DashboardStats {
  todayOrders: number
  deliveredOrders: number
  onWayOrders: number
  cancelledOrders: number
  totalRevenue: number
  pendingPayments: number
  ordersByStatus: OrderStatusCount[]
  recentApiErrors: APIError[]
  recentOrders: Order[]
  hourlyOrdersChart: ChartDataPoint[]
  hourlyRevenueChart: ChartDataPoint[]
}

export interface ChartDataPoint {
  label: string
  value: number
}

export interface OrderStatusCount {
  status: OrderStatus
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

// API Yönetimi
export interface APIError {
  id: string
  timestamp: string
  endpoint: string
  statusCode: number
  errorMessage: string
  request: string
  response: string
}

export interface APILog {
  id: string
  timestamp: string
  endpoint: string
  method: string
  statusCode: number
  responseTime: number
  request: string
  response: string
}

// Webhook Yönetimi
export interface Webhook {
  id: string
  url: string
  events: WebhookEvent[]
  isActive: boolean
  createdAt: string
  lastTriggered?: string
}

export type WebhookEvent = 'order.created' | 'order.status_changed' | 'order.delivered' | 'order.cancelled'

// Ödeme Tipi Eşleştirme
export interface PaymentMapping {
  id: string
  clientValue: string
  fiyuuValue: string
  createdAt: string
}

export type FiyuuPaymentType = 'cash' | 'card' | 'online' | 'wallet'

// Genel API Response
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Filtreleme ve Sayfalama
export interface FilterOptions {
  status?: OrderStatus | Array<OrderStatus> | 'all'
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

export type OrderStatusStats = Record<OrderStatus, number> & {
  total: number
}
