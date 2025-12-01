'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: { retry: 1, refetchOnWindowFocus: false }
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

export default QueryProvider
