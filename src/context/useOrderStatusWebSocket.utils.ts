import { OrderStatusGroup } from '@/constants'
import {
  BaseOrderDataWithRider,
  LatestOrder,
  OrderOriginalStatus,
  OrderStatusesGroups,
  OrderStatusStats,
  OrderStatusUpdateData
} from '@/types'
import type { QueryClient } from '@tanstack/react-query'
import type { OrderLikeForToast, OrdersResponse } from './useOrderStatusWebSocket.types'

type ToastContext = {
  orderId: string
  newStatus: OrderStatusesGroups
  originalStatus?: OrderOriginalStatus
  customerName?: string
}

// Tek yerde order id eşleşmesini yapacak yardımcı fonksiyon
function matchesOrderId(order: { orderId?: string; sId?: string }, orderId: string) {
  return order.sId === orderId || order.orderId === orderId
}

export function buildOrderToastMessage({ orderId, newStatus, originalStatus, customerName }: ToastContext) {
  const name = customerName ?? `#${orderId.slice(-6)}`
  const specialMessages: Partial<Record<OrderOriginalStatus, string>> = {
    [OrderOriginalStatus.ASSIGNED]: `${name} siparişi için kurye ataması yapıldı`
  }

  if (originalStatus && specialMessages[originalStatus]) return specialMessages[originalStatus]!

  if (newStatus === OrderStatusesGroups.CREATED) return 'Yeni sipariş eklendi'

  const statusLabel = OrderStatusGroup[newStatus]?.label ?? newStatus

  return `${name} siparişi ${statusLabel} olarak güncellendi`
}

/**
 * Hem ['orders'] hem ['latest-orders'] cache'lerinde arayıp
 * ilgili siparişi bulur; müşteri adını vs. toast için buradan alırız.
 */
export function findOrderForToast(queryClient: QueryClient, orderId: string): OrderLikeForToast | undefined {
  // 1) Tüm 'orders' query'lerini tara (['orders', ...] ile başlayanlar)
  const ordersQueries = queryClient.getQueriesData<OrdersResponse>({
    queryKey: ['orders']
  })

  for (const [, data] of ordersQueries) {
    if (!data) continue
    const found = data.data.find(order => matchesOrderId(order, orderId))
    if (found) return found
  }

  // 2) Tüm 'latest-orders' query'lerini tara (['latest-orders', ...])
  const latestOrdersQueries = queryClient.getQueriesData<LatestOrder[]>({
    queryKey: ['latest-orders']
  })

  for (const [, data] of latestOrdersQueries) {
    if (!data) continue
    const found = data.find(order => matchesOrderId(order, orderId))
    if (found) return found
  }

  return undefined
}

export function updateStatsCount(
  stats: OrderStatusStats,
  from?: OrderStatusesGroups,
  to?: OrderStatusesGroups
): OrderStatusStats {
  const updated: OrderStatusStats = { ...stats }
  if (from && updated[from] !== undefined) {
    updated[from] = Math.max(0, updated[from] - 1)
  }
  if (to && updated[to] !== undefined) {
    updated[to] = updated[to] + 1
  }
  return updated
}

type UpdateOrdersCacheArgs = {
  queryClient: QueryClient
  orderId: string
  newStatus: OrderStatusesGroups
  data?: OrderStatusUpdateData
}

export function updateOrdersCacheAndGetPreviousStatus({
  queryClient,
  orderId,
  newStatus,
  data
}: UpdateOrdersCacheArgs): OrderStatusesGroups | undefined {
  let previousStatus: OrderStatusesGroups | undefined

  queryClient.setQueriesData({ queryKey: ['orders'] }, (old?: OrdersResponse) => {
    const typed = old as OrdersResponse | undefined
    if (!typed) return old

    const hasOrder = typed.data.find(order => matchesOrderId(order, orderId))

    // Yeni sipariş veya listede olmayan bir sipariş: aktif listeyi invalidate et
    if (!hasOrder) queryClient.invalidateQueries({ queryKey: ['orders', 'active'] })

    const updatedData = typed.data.map(order => {
      if (!matchesOrderId(order, orderId)) return order

      previousStatus = order.status
      return {
        ...order,
        status: newStatus,
        courierInfo:
          data && 'riderName' in data ? { name: (data as BaseOrderDataWithRider).riderName } : order.courierInfo
      }
    })

    return { ...typed, data: updatedData }
  })

  return previousStatus
}

type UpdateStatsArgs = {
  queryClient: QueryClient
  previousStatus?: OrderStatusesGroups
  newStatus: OrderStatusesGroups
}

export function updateOrdersStatsCache({ queryClient, previousStatus, newStatus }: UpdateStatsArgs) {
  queryClient.setQueryData<OrderStatusStats>(['ordersStats'], old => {
    if (!old) return old
    return updateStatsCount(old, previousStatus, newStatus)
  })
}

export function updateLatestOrdersCache(queryClient: QueryClient, orderId: string, newStatus: OrderStatusesGroups) {
  queryClient.setQueriesData({ queryKey: ['latest-orders'] }, old => {
    const typed = old as LatestOrder[] | undefined
    if (!typed) return old

    if (newStatus === OrderStatusesGroups.CREATED) {
      // Yeni sipariş geldiğinde invalidate et (yeniden fetch eder)
      queryClient.invalidateQueries({ queryKey: ['latest-orders'] })
      return old
    }

    return typed.map(order => (matchesOrderId(order, orderId) ? { ...order, status: newStatus } : order))
  })
}

export function updateDashboardStatsCache({ queryClient, previousStatus, newStatus }: UpdateStatsArgs) {
  queryClient.setQueriesData({ queryKey: ['dashboard-stats'] }, old => {
    const typed = old as OrderStatusStats | undefined
    if (!typed) return old
    return updateStatsCount(typed, previousStatus, newStatus)
  })
}
