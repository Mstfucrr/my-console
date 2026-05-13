import { DeliveryCheckList, Motorcycle } from '@/components/svg'
import { OrderStatusesGroups } from '@/types'
import {
  BadgeTurkishLira,
  CarIcon,
  CheckCircle,
  Clock,
  Home,
  LucideIcon,
  Plus,
  ShoppingCart,
  XCircle
} from 'lucide-react'

// Module Icons
export const ModuleIcons = {
  B2BCommerce: CarIcon,
  Reconciliation: BadgeTurkishLira,
  Orders: ShoppingCart,
  OrdersCreate: Plus,
  Reports: DeliveryCheckList,
  Home: Home
} as const

// Order Status Icons - Used consistently across all pages (group-based)
export const OrderStatusIcons: Record<OrderStatusesGroups, LucideIcon | typeof Motorcycle> = {
  [OrderStatusesGroups.CREATED]: Clock,
  [OrderStatusesGroups.SHIPPED]: Motorcycle,
  [OrderStatusesGroups.DELIVERED]: CheckCircle,
  [OrderStatusesGroups.CANCELLED]: XCircle
} as const

// Same text labels should use the same icon for consistency
export const StatCardIcons = {
  TotalOrders: ShoppingCart
} as const
