'use client'

import { getToken } from '@/lib/local-storage-helper'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

type WebSocketInvalidateType = 'invalidate' | 'update'

interface QueryInvalidateEvent {
  entity: string[]
  id?: string | number
  type?: WebSocketInvalidateType
}

// JSON benzeri generic payload'lar için basit bir type:
type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonObject | JsonValue[]
export interface JsonObject {
  [key: string]: JsonValue
}

// Event map generic: event adı → payload tipi
export interface UseWebSocketOptions<TEventMap> {
  namespace: string
  enabled?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
  eventHandlers?: {
    [K in keyof TEventMap]?: (data: TEventMap[K]) => void
  }
}

export interface UseWebSocketReturn {
  socket: Socket | null
  isConnected: boolean
}

/**
 * WebSocket lifecycle hook'u.
 * Socket.IO namespace'lerine bağlanmak için kullanılır.
 */
export function useWebSocket<TEventMap = Record<string, never>>(
  options: UseWebSocketOptions<TEventMap>
): UseWebSocketReturn {
  const { namespace, enabled = true, onConnect, onDisconnect, onError, eventHandlers } = options

  const queryClient = useQueryClient()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const callbacksRef = useRef({ onConnect, onDisconnect, onError, eventHandlers })

  useEffect(() => {
    // Callback'leri güncelle
    callbacksRef.current = { onConnect, onDisconnect, onError, eventHandlers }
  })

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    const { accessToken } = getToken()
    if (!accessToken) {
      console.warn('WebSocket: No access token found')
      return
    }

    // Eğer aynı namespace'te zaten bağlıysa, yeniden bağlanma
    if (socketRef.current?.connected) {
      return
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

    // Eğer baseURL'in sonunda /api veya / varsa kaldır
    const cleanBaseURL = baseURL.replace(/\/api\/?$/, '').replace(/\/$/, '')
    // Eğer namespace'in başında / varsa kaldır
    const normalizedNamespace = namespace.startsWith('/') ? namespace : `/${namespace}`
    // WebSocket URL'ini oluştur
    const wsURL = `${cleanBaseURL}${normalizedNamespace}`

    // Eski bağlantıyı kapat
    if (socketRef.current) {
      socketRef.current.disconnect()
    }

    const instance = io(wsURL, {
      path: '/api/socket.io',
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true
    })

    socketRef.current = instance

    instance.on('connect', () => {
      setSocket(instance)
      setIsConnected(true)
      callbacksRef.current.onConnect?.()
    })

    instance.on('disconnect', () => {
      setIsConnected(false)
      setSocket(null)
      callbacksRef.current.onDisconnect?.()
    })

    instance.on('connect_error', (error: Error) => {
      callbacksRef.current.onError?.(error)
    })

    instance.on('query-invalidate', (event: QueryInvalidateEvent) => {
      const queryKey = [...event.entity, event.id].filter(value => value !== undefined)
      queryClient.invalidateQueries({ queryKey })
    })

    if (callbacksRef.current.eventHandlers) {
      const handlers = callbacksRef.current.eventHandlers
      ;(Object.keys(handlers) as Array<keyof TEventMap>).forEach(eventName => {
        const handler = handlers[eventName]
        if (handler) {
          instance.on(String(eventName), handler)
        }
      })
    }

    return () => {
      if (instance) {
        instance.off('connect')
        instance.off('disconnect')
        instance.off('connect_error')
        instance.off('query-invalidate')

        if (callbacksRef.current.eventHandlers) {
          const handlers = callbacksRef.current.eventHandlers
          ;(Object.keys(handlers) as Array<keyof TEventMap>).forEach(eventName => {
            instance.off(String(eventName))
          })
        }

        instance.disconnect()
        socketRef.current = null
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [namespace, enabled, queryClient])

  return {
    socket,
    isConnected
  }
}
