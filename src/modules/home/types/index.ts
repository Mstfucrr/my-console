import { LucideIcon } from 'lucide-react'

export type OrderStatus = 'delivered' | 'on_way' | 'cancelled' | 'preparing' | 'ready' | 'pending'

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

export type DashboardStats = {
  todayOrders: number
  deliveredOrders: number
  onWayOrders: number
  cancelledOrders: number
  ordersByStatus: OrdersByStatus[]
  recentApiErrors: RecentApiError[]
}

export type Stats = {
  title: string
  value: number
  Icon: LucideIcon
  hint: string
  color: string
}
