import { LatestOrder } from '@/modules/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { DateRange } from 'react-day-picker'
import { dashboardService } from '../service'
import type { DashboardGraphs, DashboardStats } from '../types'

export function useGetStats(
  dateRange?: DateRange,
  options?: Omit<UseQueryOptions<DashboardStats, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['dashboard-stats', JSON.stringify(dateRange)],
    queryFn: () => dashboardService.getStats(dateRange),
    ...options
  })
}

export function useGetLatestOrders(
  dateRange?: DateRange,
  options?: Omit<UseQueryOptions<Array<LatestOrder>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['latest-orders', JSON.stringify(dateRange)],
    queryFn: () => dashboardService.getLatestOrders(dateRange),
    ...options
  })
}

export function useGetGraphs(
  dateRange?: DateRange,
  options?: Omit<UseQueryOptions<DashboardGraphs, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['graphs', JSON.stringify(dateRange)],
    queryFn: () => dashboardService.getGraphs(dateRange),
    enabled: false,
    ...options
  })
}
