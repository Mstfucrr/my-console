import type { ReconciliationRecord, ReconciliationStats } from "../types"

export const mockReconciliationData: ReconciliationRecord[] = [
  {
    id: "REC-001",
    date: "2024-01-25",
    totalOrders: 45,
    totalAmount: 2850.75,
    platformFee: 142.54,
    netAmount: 2708.21,
    status: "completed",
    paymentMethod: "Bank Transfer",
    settlementDate: "2024-01-26",
  },
  {
    id: "REC-002",
    date: "2024-01-24",
    totalOrders: 38,
    totalAmount: 2340.2,
    platformFee: 117.01,
    netAmount: 2223.19,
    status: "completed",
    paymentMethod: "Bank Transfer",
    settlementDate: "2024-01-25",
  },
  {
    id: "REC-003",
    date: "2024-01-23",
    totalOrders: 52,
    totalAmount: 3125.4,
    platformFee: 156.27,
    netAmount: 2969.13,
    status: "pending",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "REC-004",
    date: "2024-01-22",
    totalOrders: 29,
    totalAmount: 1875.6,
    platformFee: 93.78,
    netAmount: 1781.82,
    status: "failed",
    paymentMethod: "Bank Transfer",
  },
]

export const mockStats: ReconciliationStats = {
  totalSettled: 4931.4,
  totalPending: 2969.13,
  totalFailed: 1781.82,
  monthlyRevenue: 15420.95,
  platformFees: 771.05,
  netRevenue: 14649.9,
}
