'use client'

import { OrderStatusGroup } from '@/constants'
import {
  BaseOrderDataWithRider,
  LatestOrder,
  Order,
  OrderOriginalStatus,
  OrderStatusesGroups,
  OrderStatusStats,
  OrderStatusUpdateData
} from '@/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { createWebSocketNamespace, type WebSocketContextValue } from './WebsocketContext'

interface OrderStatusUpdate {
  orderId: string
  status: OrderStatusesGroups
  originalStatus?: OrderOriginalStatus
  timestamp: string
  data?: OrderStatusUpdateData
}

type ToastContext = {
  orderId: string
  newStatus: OrderStatusesGroups
  originalStatus?: OrderOriginalStatus
  customerName?: string
}

function buildOrderToastMessage({ orderId, newStatus, originalStatus, customerName }: ToastContext) {
  // 1) Created her zaman en üst öncelik
  if (newStatus === OrderStatusesGroups.CREATED) {
    return 'Yeni sipariş eklendi'
  }

  // 2) Müşteri adı yoksa fallback
  const name = customerName ?? `#${orderId.slice(-6)}`
  const statusLabel = OrderStatusGroup[newStatus]?.label ?? newStatus

  // 3) Özel durumlar
  const specialMessages: Partial<Record<OrderOriginalStatus, string>> = {
    [OrderOriginalStatus.ASSIGNED]: `${name} siparişi için kurye ataması yapıldı`
  }

  if (originalStatus && specialMessages[originalStatus]) return specialMessages[originalStatus]!

  // 4) Default
  return `${name} siparişi ${statusLabel} olarak güncellendi`
}

// Order WebSocket event map’i
interface OrderEvents {
  'order-status-update': OrderStatusUpdate
}

// Factory: Order events için context + provider + hook
const {
  WebSocketProvider: OrderStatusWebSocketBaseProvider,
  useWebSocketFromContext: useOrderStatusWebSocketFromContext
} = createWebSocketNamespace<OrderEvents>()

type OrdersResponse = { data: Order[]; total: number }

// Toast için bize lazım olan minimal shape
type OrderLikeForToast = Pick<Order, 'orderId' | 'customerName'> | Pick<LatestOrder, 'orderId' | 'customerName'>

/**
 * Hem ['orders'] hem ['latest-orders'] cache'lerinde arayıp
 * ilgili siparişi bulur; müşteri adını vs. toast için buradan alırız.
 */
function findOrderForToast(queryClient: QueryClient, orderId: string): OrderLikeForToast | undefined {
  // 1) Tüm 'orders' query'lerini tara (['orders', ...] ile başlayanlar)
  const ordersQueries = queryClient.getQueriesData<OrdersResponse>({
    queryKey: ['orders']
  })

  for (const [, data] of ordersQueries) {
    if (!data) continue
    const found = data.data.find(order => order.orderId === orderId)
    if (found) return found
  }

  // 2) Tüm 'latest-orders' query'lerini tara (['latest-orders', ...])
  const latestOrdersQueries = queryClient.getQueriesData<LatestOrder[]>({
    queryKey: ['latest-orders']
  })

  for (const [, data] of latestOrdersQueries) {
    if (!data) continue
    const found = data.find(order => order.orderId === orderId)
    if (found) return found
  }

  return undefined
}

function updateStatsCount(
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

// Bu Provider gerçek domain mantığını içeriyor (query güncelleme vs.)
export function OrderStatusWebSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const handleOrderStatusUpdate = useCallback(
    (update: OrderStatusUpdate) => {
      const { orderId, status: newStatus, data, originalStatus } = update
      let previousStatus: OrderStatusesGroups | undefined

      const orderForToast =
        newStatus === OrderStatusesGroups.CREATED ? undefined : findOrderForToast(queryClient, orderId)

      const message = buildOrderToastMessage({
        orderId,
        newStatus,
        originalStatus,
        customerName: orderForToast?.customerName
      })

      toast.info(message, { position: 'top-right', autoClose: 3000 })

      // 2) Orders cache’ini güncelle
      queryClient.setQueriesData({ queryKey: ['orders'] }, old => {
        const typed = old as OrdersResponse | undefined
        if (!typed) return old

        const hasOrder = typed.data.find(order => order.orderId === orderId)

        // Yeni sipariş veya listede olmayan bir sipariş: aktif listeyi invalidate et
        if (!hasOrder || newStatus === OrderStatusesGroups.CREATED) {
          queryClient.invalidateQueries({ queryKey: ['orders', 'active'] })
        }

        const updatedData = typed.data.map(order => {
          if (order.orderId === orderId) {
            previousStatus = order.status
            return {
              ...order,
              status: newStatus,
              courierInfo:
                data && 'riderName' in data ? { name: (data as BaseOrderDataWithRider).riderName } : order.courierInfo
            }
          }
          return order
        })

        return { ...typed, data: updatedData }
      })

      // 3) Orders stats cache’ini güncelle
      queryClient.setQueryData<OrderStatusStats>(['ordersStats'], old => {
        if (!old) return old
        return updateStatsCount(old, previousStatus, newStatus)
      })

      // 4) Dashboard latest-orders cache'ini güncelle
      queryClient.setQueriesData({ queryKey: ['latest-orders'] }, old => {
        const typed = old as LatestOrder[] | undefined
        if (!typed) return old

        if (newStatus === OrderStatusesGroups.CREATED) {
          // Yeni sipariş geldiğinde invalidate et (yeniden fetch eder)
          queryClient.invalidateQueries({ queryKey: ['latest-orders'] })
          return old
        }

        // Status update olduğunda ilgili order'ı güncelle
        const updatedData = typed.map(order => {
          if (order.orderId === orderId) {
            return { ...order, status: newStatus }
          }
          return order
        })

        return updatedData
      })

      // 5) Dashboard stats cache'ini güncelle (tüm dateRange'ler için)
      queryClient.setQueriesData({ queryKey: ['dashboard-stats'] }, old => {
        const typed = old as OrderStatusStats | undefined
        if (!typed) return old
        return updateStatsCount(typed, previousStatus, newStatus)
      })
    },
    [queryClient]
  )

  const eventHandlers = useMemo(
    () => ({
      'order-status-update': handleOrderStatusUpdate
    }),
    [handleOrderStatusUpdate]
  )

  return (
    <OrderStatusWebSocketBaseProvider namespace='/order-status' eventHandlers={eventHandlers}>
      {children}
    </OrderStatusWebSocketBaseProvider>
  )
}

export function useOrderStatusWebSocket(): WebSocketContextValue<OrderEvents> {
  return useOrderStatusWebSocketFromContext()
}
