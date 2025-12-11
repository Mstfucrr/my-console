'use client'

import { useWebSocket, type UseWebSocketOptions, type UseWebSocketReturn } from '@/hooks/websocket/useWebSocket'
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'

// Context value: socket bilgisi + emit fonksiyonu
export interface WebSocketContextValue<TEventMap> extends UseWebSocketReturn {
  emit: <K extends keyof TEventMap>(event: K, payload: TEventMap[K]) => void
}

// Provider prop’ları: useWebSocketOptions + children
export interface WebSocketProviderProps<TEventMap> extends UseWebSocketOptions<TEventMap> {
  children: ReactNode
}

/**
 * Her namespace/eventMap için ayrı Context + Provider + hook üreten factory.
 * Örnek kullanım:
 *   const { WebSocketProvider, useWebSocketFromContext } =
 *     createWebSocketNamespace<OrderEvents>();
 */
export function createWebSocketNamespace<TEventMap>() {
  const Ctx = createContext<WebSocketContextValue<TEventMap> | undefined>(undefined)

  function WebSocketProvider({ children, ...options }: WebSocketProviderProps<TEventMap>) {
    const { socket, isConnected } = useWebSocket<TEventMap>(options)

    const emit = useCallback(
      <K extends keyof TEventMap>(event: K, payload: TEventMap[K]) => {
        if (!socket) return
        socket.emit(String(event), payload)
      },
      [socket]
    )

    const value = useMemo<WebSocketContextValue<TEventMap>>(
      () => ({
        socket,
        isConnected,
        emit
      }),
      [socket, isConnected, emit]
    )

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
  }

  function useWebSocketFromContext(): WebSocketContextValue<TEventMap> {
    const ctx = useContext(Ctx)
    if (!ctx) {
      throw new Error('useWebSocketFromContext must be used within its WebSocketProvider')
    }
    return ctx
  }

  return {
    WebSocketProvider,
    useWebSocketFromContext
  }
}
