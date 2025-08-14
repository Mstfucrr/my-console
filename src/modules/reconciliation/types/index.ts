export interface ReconciliationRecord {
  id: string
  date: string
  totalOrders: number
  totalAmount: number
  platformFee: number
  netAmount: number
  status: "completed" | "pending" | "failed"
  paymentMethod: string
  settlementDate?: string
}

export interface ReconciliationStats {
  totalSettled: number
  totalPending: number
  totalFailed: number
  monthlyRevenue: number
  platformFees: number
  netRevenue: number
}
