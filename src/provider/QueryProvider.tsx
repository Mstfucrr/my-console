'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
          // WebSocket ile real-time update olduğu için staleTime'i artır
          // Sadece WebSocket event'leri ile invalidate edilecek
          staleTime: Infinity
        }
      }
    })
  )

  useEffect(() => {
    if (typeof window !== 'undefined') window.__TANSTACK_QUERY_CLIENT__ = queryClient
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' /> */}
    </QueryClientProvider>
  )
}
