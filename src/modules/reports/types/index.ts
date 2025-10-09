import type { OrderStatus } from '@/modules/types'

export interface ReportRecord {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  orderDate: string
  createdDate: string
  deliveryDate: string
  totalAmount: number
  platformFee: number
  netAmount: number
  status: OrderStatus
  paymentMethod: string
  deliveryAddress: string
  notes?: string
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

export interface ReportsStats {
  totalOrders: number
  totalRevenue: number
  totalFees: number
  netRevenue: number
}
