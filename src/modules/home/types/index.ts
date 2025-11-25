import { OrderStatusesGroups } from '@/types'
import { LucideIcon } from 'lucide-react'

export type OrdersByStatus = {
  status: OrderStatusesGroups
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

export type Stats = {
  title: string
  value: number
  Icon: LucideIcon
  color: string
}
