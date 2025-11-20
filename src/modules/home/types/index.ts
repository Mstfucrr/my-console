import { ChartDataPoint, OrderStatus } from '@/modules/types'
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
  totalOrder: number
  deliveredOrder: number
  inProgressOrder: number
  cancelOrder: number
}

export interface DashboardGraphs {
  orderCount: ChartDataPoint[]
  revenue: ChartDataPoint[]
  deliveryTime: ChartDataPoint[]
}

export type Stats = {
  title: string
  value: number
  Icon: LucideIcon
  color: string
}
