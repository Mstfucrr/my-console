'use client'

import { OrderStatusStats } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { ordersService } from '../service/order.service'

export function useOrdersStats() {
  const {
    data: statsData,
    error: statsError,
    isLoading: isStatsLoading
  } = useQuery<OrderStatusStats, Error>({
    queryKey: ['ordersStats'],
    staleTime: Infinity,
    queryFn: () => ordersService.getOrdersStats()
  })

  const stats = useMemo(
    () => ({
      total: statsData?.total ?? 0,
      created: statsData?.created ?? 0,
      shipped: statsData?.shipped ?? 0,
      delivered: statsData?.delivered ?? 0,
      cancelled: statsData?.cancelled ?? 0
    }),
    [statsData]
  )

  return {
    stats,
    isStatsLoading,
    error: statsError?.message || ''
  }
}
