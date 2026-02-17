'use client'

import { OrderStatusesGroups } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { createWebSocketNamespace, type WebSocketContextValue } from './WebsocketContext'
import type { OrderEvents, OrderStatusUpdate } from './useOrderStatusWebSocket.types'
import {
  buildOrderToastMessage,
  findOrderForToast,
  updateDashboardStatsCache,
  updateLatestOrdersCache,
  updateOrdersCacheAndGetPreviousStatus,
  updateOrdersStatsCache
} from './useOrderStatusWebSocket.utils'

// Factory: Order events için context + provider + hook
const {
  WebSocketProvider: OrderStatusWebSocketBaseProvider,
  useWebSocketFromContext: useOrderStatusWebSocketFromContext
} = createWebSocketNamespace<OrderEvents>()

// Bu Provider gerçek domain mantığını içeriyor (query güncelleme vs.)
export function OrderStatusWebSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const handleOrderStatusUpdate = useCallback(
    (update: OrderStatusUpdate) => {
      const { orderId, status: newStatus, data, originalStatus } = update

      const orderForToast =
        newStatus === OrderStatusesGroups.CREATED ? undefined : findOrderForToast(queryClient, orderId)

      const message = buildOrderToastMessage({
        orderId,
        newStatus,
        originalStatus,
        customerName: orderForToast?.customerName
      })

      toast.info(message, { position: 'top-right', autoClose: 3000 })

      const previousStatus = updateOrdersCacheAndGetPreviousStatus({ queryClient, orderId, newStatus, data })

      // 3) Orders stats cache’ini güncelle
      updateOrdersStatsCache({ queryClient, previousStatus, newStatus })

      // 4) Dashboard latest-orders cache'ini güncelle
      updateLatestOrdersCache(queryClient, orderId, newStatus)

      // 5) Dashboard stats cache'ini güncelle (tüm dateRange'ler için)
      updateDashboardStatsCache({ queryClient, previousStatus, newStatus })
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
