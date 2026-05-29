'use client'

import { useEnabledOnActiveTab } from '@/hooks/useEnabledOnActiveTab'
import { OrderOriginalStatus, OrderStatusesGroups } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import { createWebSocketNamespace, type WebSocketContextValue } from './WebsocketContext'
import type { OrderEvents, OrderStatusUpdate } from './useOrderStatusWebSocket.types'
import {
  buildOrderToastMessage,
  findOrderForToast,
  playCourierAssignedSound,
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

const TOAST_DISABLE_AFTER_TAB_INACTIVE_MS = 60_000 // 1 dakika
const TOAST_CLEAR_INTERVAL_MS = 10 * 60_000 // 10 dakika

// Bu Provider gerçek domain mantığını içeriyor (query güncelleme vs.)
export function OrderStatusWebSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const toastCleanupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearToast = () => {
    toast.clearWaitingQueue()
    toast.dismiss()
  }

  const clearToastCleanupInterval = useCallback(() => {
    if (!toastCleanupIntervalRef.current) return
    clearInterval(toastCleanupIntervalRef.current)
    toastCleanupIntervalRef.current = null
  }, [])

  const toastEnabledRef = useEnabledOnActiveTab({
    disableAfterMs: TOAST_DISABLE_AFTER_TAB_INACTIVE_MS,
    onDisable: () => {
      clearToast()
      clearToastCleanupInterval()
      toastCleanupIntervalRef.current = setInterval(clearToast, TOAST_CLEAR_INTERVAL_MS)
    },
    onEnable: clearToastCleanupInterval
  })

  useEffect(() => clearToastCleanupInterval, [clearToastCleanupInterval])

  const handleOrderStatusUpdate = useCallback(
    (update: OrderStatusUpdate) => {
      const { orderId, status: newStatus, data, originalStatus } = update

      if (originalStatus === OrderOriginalStatus.ASSIGNED) {
        playCourierAssignedSound()
      }

      if (toastEnabledRef.current || originalStatus === OrderOriginalStatus.ASSIGNED) {
        const orderForToast =
          newStatus === OrderStatusesGroups.CREATED ? undefined : findOrderForToast(queryClient, orderId)

        const message = buildOrderToastMessage({
          orderId,
          newStatus,
          originalStatus,
          customerName: orderForToast?.customerName
        })

        toast.info(message, { position: 'top-right', autoClose: 3000 })
      }

      const previousStatus = updateOrdersCacheAndGetPreviousStatus({ queryClient, orderId, newStatus, data })

      // 3) Orders stats cache’ini güncelle
      updateOrdersStatsCache({ queryClient, previousStatus, newStatus })

      // 4) Dashboard latest-orders cache'ini güncelle
      updateLatestOrdersCache(queryClient, orderId, newStatus)

      // 5) Dashboard stats cache'ini güncelle (tüm dateRange'ler için)
      updateDashboardStatsCache({ queryClient, previousStatus, newStatus })
    },
    [queryClient, toastEnabledRef]
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
