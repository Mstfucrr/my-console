import type { OrderStatusStats } from '@/types'
import type { OrderStatsResponse } from '../types/api'

export function mapOrderStatsResponse(stats: OrderStatsResponse): OrderStatusStats {
  // Created = Total - (Delivered + InProgress + Cancelled)
  const created = Math.max(0, stats.totalOrder - (stats.deliveredOrder + stats.inProgressOrder + stats.cancelOrder))

  return {
    total: stats.totalOrder,
    created,
    shipped: stats.inProgressOrder,
    delivered: stats.deliveredOrder,
    cancelled: stats.cancelOrder
  }
}
