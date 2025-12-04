'use client'

import { Order } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { JsonObject, useWebSocket, UseWebSocketReturn } from './useWebSocket'

interface OrderStatusUpdate {
  orderId: string
  status: string
  originalStatus?: string
  timestamp: string
  data?: JsonObject
}

// Order WebSocket event map'i
interface OrderEvents {
  'order-status-update': OrderStatusUpdate
}

export function useOrderStatusWebSocket(): UseWebSocketReturn {
  const queryClient = useQueryClient()

  const handleOrderStatusUpdate = useCallback(
    (update: OrderStatusUpdate) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })

      queryClient.setQueriesData({ queryKey: ['orders'], exact: false }, (oldData: unknown) => {
        type OrdersResponse = { data: Order[]; total: number }

        const typed = oldData as OrdersResponse | undefined
        if (!typed) return oldData

        const updatedData = typed.data.map(order =>
          order.orderId === update.orderId ? { ...order, status: update.status } : order
        )

        return { ...typed, data: updatedData }
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
