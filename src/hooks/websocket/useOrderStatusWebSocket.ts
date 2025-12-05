'use client'

import { Order, OrderStatusesGroups, OrderStatusStats } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { JsonObject, useWebSocket, UseWebSocketReturn } from './useWebSocket'

interface OrderStatusUpdate {
  orderId: string
  status: OrderStatusesGroups
  originalStatus?: OrderStatusesGroups
  timestamp: string
  data?: JsonObject
}

// Order WebSocket event map'i
interface OrderEvents {
  'order-status-update': OrderStatusUpdate
}

function updateStatsCount(
  stats: OrderStatusStats,
  from?: OrderStatusesGroups,
  to?: OrderStatusesGroups
): OrderStatusStats {
  const updated = { ...stats }
  if (from && updated[from] !== undefined) {
    updated[from] = Math.max(0, updated[from] - 1)
  }
  if (to && updated[to] !== undefined) {
    updated[to] = updated[to] + 1
  }
  return updated
}

export function useOrderStatusWebSocket(): UseWebSocketReturn {
  const queryClient = useQueryClient()

  // Sadece local query datasını günceller, refetch/invalidasyon YOK
  const handleOrderStatusUpdate = useCallback(
    (update: OrderStatusUpdate) => {
      const { orderId, status: newStatus, data } = update

      // 1) Önce cache’teki mevcut order’ı bul (eski statüyü çıkarmak için)
      let previousStatus: OrderStatusesGroups | undefined = undefined

      queryClient.setQueriesData({ queryKey: ['orders'] }, (old: unknown) => {
        const typed = old as { data: Order[]; total: number }

        if (!typed) return old

        const updatedData = typed.data.map(order => {
          if (order.orderId === orderId) {
            previousStatus = order.status
            return { ...order, status: newStatus, courierInfo: data }
          }
          return order
        })

        return { ...typed, data: updatedData }
      })

      queryClient.setQueryData<OrderStatusStats>(['ordersStats'], old => {
        if (!old) return old
        return updateStatsCount(old, previousStatus, newStatus)
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

  return useWebSocket<OrderEvents>({
    namespace: '/order-status',
    eventHandlers
  })
}
