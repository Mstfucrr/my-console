import { DeliveryCheckList, DeliveryShipmentPackagesAdd, Motorcycle } from '@/components/svg'
import type { OrderStatus } from '@/modules/types'
import {
  BadgeTurkishLira,
  BarChart2,
  CheckCircle,
  Clock,
  CreditCard,
  Home,
  LucideIcon,
  ShoppingCart,
  XCircle
} from 'lucide-react'

// Module Icons
export const ModuleIcons = {
  Reconciliation: BadgeTurkishLira,
  Orders: ShoppingCart,
  Reports: BarChart2,
  Home: Home
} as const

// Order Status Icons - Used consistently across all pages
export const OrderStatusIcons: Record<OrderStatus, LucideIcon | typeof Motorcycle> = {
  created: Clock,
  shipped: Motorcycle,
  delivered: CheckCircle,
  cancelled: XCircle
} as const

// Other Dashboard Icons (non-status related)
export const DashboardIcons = {
  TotalOrders: ShoppingCart,
  TotalRevenue: CreditCard,
  PendingPayments: Clock
} as const

// StatCard Icons - Consistent icons based on text labels
// Same text labels should use the same icon for consistency
export const StatCardIcons = {
  // Revenue related (Toplam Ciro, Toplam Gelir, Net Gelir, Total Revenue)
  TotalRevenue: CreditCard,
  NetRevenue: CreditCard,
  Revenue: CreditCard,

  // Pending related (Bekleyen Ödeme, Tahsilat Bekleyen, Pending)
  Pending: Clock,
  PendingPayments: Clock,

  // Approved/Settled related (Ödenen Tutar, Total Approved)
  Approved: CheckCircle,
  Settled: CheckCircle,

  // Orders related (Toplam Sipariş, Total Orders)
  TotalOrders: ShoppingCart,
  Orders: ShoppingCart
} as const

// Quick Action Icons
export const QuickActionIcons = {
  Orders: ShoppingCart,
  NewOrder: DeliveryShipmentPackagesAdd,
  Reconciliation: BadgeTurkishLira,
  Reports: DeliveryCheckList
} as const

// Export all icons for convenience
export type IconType = LucideIcon
