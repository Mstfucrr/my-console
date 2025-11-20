import { Order } from '@/modules/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { DateRange } from 'react-day-picker'
import { dashboardService } from '../service'
import type { DashboardGraphs, DashboardStats } from '../types'

export function useGetStats(
  dateRange?: DateRange,
  options?: Omit<UseQueryOptions<DashboardStats, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['dashboard-stats', dateRange],
    queryFn: () => dashboardService.getStats(dateRange),
    ...options
  })
}

export function useGetLatestOrders(
  dateRange?: DateRange,
  options?: Omit<UseQueryOptions<Array<Order>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['latest-orders', dateRange],
    queryFn: () => dashboardService.getLatestOrders(dateRange),
    ...options
  })
}

export function useGetGraphs(
  dateRange?: DateRange,
  options?: Omit<UseQueryOptions<DashboardGraphs, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['graphs', dateRange],
    queryFn: () => dashboardService.getGraphs(dateRange),
    ...options
  })
}
