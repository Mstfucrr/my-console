import { APIError, ChartDataPoint, Order, OrderStatus, OrderStatusCount } from '@/modules/types'
import { LucideIcon } from 'lucide-react'

export type OrdersByStatus = {
  status: OrderStatus
  count: number
  percentage: number
}

export type RecentApiError = {
  id: string
  endpoint: string
  errorMessage: string
  timestamp: string
  statusCode: number
}

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
  averageDeliveryTimeChart: ChartDataPoint[]
}

export type Stats = {
  title: string
  value: number
  Icon: LucideIcon
  hint: string
  color: string
}
