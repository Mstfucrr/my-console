'use client'

import { OrderStatusGroup } from '@/constants'
import { Order, OrderStatusesGroups, OrderStatusStats } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
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
  const isOrdersPage = pathname?.startsWith('/orders')

  const handleOrderStatusUpdate = useCallback(
    (update: OrderStatusUpdate) => {
      const { orderId, status: newStatus, data } = update

      let previousStatus: OrderStatusesGroups | undefined

      if (!isOrdersPage) {
        const statusLabel = OrderStatusGroup[newStatus]?.label ?? newStatus
        if (newStatus === OrderStatusesGroups.CREATED) {
          toast.info(`Yeni sipariş eklendi`, {
            position: 'top-right',
            autoClose: 3000
          })
        } else {
          toast.info(`#${orderId.slice(-6)} sipariş durumu ${statusLabel} olarak güncellendi `, {
            position: 'top-right',
            autoClose: 3000
          })
        }
      }

      // Orders cache’ini güncelle
      queryClient.setQueriesData({ queryKey: ['orders'] }, old => {
        type OrdersResponse = { data: Order[]; total: number }

        const typed = old as OrdersResponse | undefined
        if (!typed) return old

        const hasOrder = typed.data.find(order => order.orderId === orderId)
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

      queryClient.setQueryData<OrderStatusStats>(['ordersStats'], old => {
        if (!old) return old
        return updateStatsCount(old, previousStatus, newStatus)
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

// Component'ler için kullanacağın hook:
// Artık HİÇBİR component `useWebSocket`’i direkt çağırmıyor!
export function useOrderStatusWebSocket(): WebSocketContextValue<OrderEvents> {
  return useOrderStatusWebSocketFromContext()
}
