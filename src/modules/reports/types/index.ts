import type { OrderStatusesGroups } from '@/types'

export interface ReportRecord {
  RestaurantId: string
  RestaurantName: string
  OrderId: string
  TotalAmount: number
  Name: string
  IsPrepaid: boolean
  Status: OrderStatusesGroups
  CarrierId: string
  CreatedOn: string
  customer_name: string
}

export interface ReportsFilters {
  search: string
  status: string
  dateRange: {
    from: string
    to: string
  }
  paymentMethod: string
}

export interface SendEmailResponse {
  accepted: boolean
  message: string
}
