'use client'

import { OrderStatusGroup } from '@/constants'
import { LatestOrder, Order, OrderStatusesGroups, OrderStatusStats } from '@/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { JsonObject } from '../hooks/websocket/useWebSocket'
import { createWebSocketNamespace, type WebSocketContextValue } from './WebsocketContext'

interface OrderStatusUpdate {
  orderId: string
  status: OrderStatusesGroups
  originalStatus?: OrderStatusesGroups
  timestamp: string
  data?: JsonObject
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
  const pathname = usePathname()
  const isOrdersPage = useMemo(() => pathname?.startsWith('/orders'), [pathname])

  const handleOrderStatusUpdate = useCallback(
    (update: OrderStatusUpdate) => {
      const { orderId, status: newStatus, data } = update
      let previousStatus: OrderStatusesGroups | undefined

      // 1) Önce toast mesajını hazırlayalım (cache olup olmamasından bağımsız)
      if (!isOrdersPage) {
        if (newStatus === OrderStatusesGroups.CREATED) {
          // Yeni sipariş - isim olmasa da generic mesaj
          toast.info('Yeni sipariş eklendi', {
            position: 'top-right',
            autoClose: 3000
          })
        } else {
          const orderForToast = findOrderForToast(queryClient, orderId)
          console.log('orderForToast', orderForToast)
          const customerName = orderForToast?.customerName ?? `#${orderId.slice(-6)}`
          const statusLabel = OrderStatusGroup[newStatus]?.label ?? newStatus

          toast.info(`${customerName} siparişi ${statusLabel} olarak güncellendi`, {
            position: 'top-right',
            autoClose: 3000
          })
        }
      }

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
            return { ...order, status: newStatus, courierInfo: data }
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
    [queryClient, isOrdersPage]
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
