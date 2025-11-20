'use client'

import { type Order, type OrderStatus } from '@/modules/types'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { ACTIVE_STATUS, COMPLETED_STATUS } from '../constants'
import { ordersService } from '../service'
import { OrderFilterProperties } from '../types'

export interface OrdersContextType {
  activeTab: 'active' | 'completed'
  filters: OrderFilterProperties
  handleFiltersChange: (newFilters: OrderFilterProperties) => void
  clearFilters: () => void
  activeOrders: Order[]
  completedOrders: Order[]
  completedTotal: number
  stats: {
    total: number
    created: number
    shipped: number
    delivered: number
    cancelled: number
  }
  isLoadingActive: boolean
  isFetchingActive: boolean
  isLoadingCompleted: boolean
  isFetchingCompleted: boolean
  isStatsLoading: boolean
  error: string
  setActiveTab: (tab: 'active' | 'completed') => void
  handleCreateOrderSuccess: () => void
  refreshAllData: () => void
  refetchActiveOrders: () => void
  refetchCompletedOrders: () => void
}

export const defaultOrderFilters: OrderFilterProperties = {
  status: 'all',
  search: ''
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [filters, setFilters] = useState<OrderFilterProperties>(defaultOrderFilters)

  const handleFiltersChange = (newFilters: OrderFilterProperties) => {
    setFilters(newFilters)
    // Auto-switch tab based on status
    if (newFilters.status !== 'all') {
      const isActiveStatus = ACTIVE_STATUS.includes(newFilters.status)
      const isCompletedStatus = COMPLETED_STATUS.includes(newFilters.status)
      if (isActiveStatus && !isCompletedStatus) {
        setActiveTab('active')
      } else if (isCompletedStatus && !isActiveStatus) {
        setActiveTab('completed')
      }
    }
  }

  const clearFilters = () => {
    setFilters(defaultOrderFilters)
  }

  const activeStatuses = filters.status === 'all' ? ACTIVE_STATUS : filters.status
  const {
    data: activeOrdersData,
    isLoading: isLoadingActive,
    isFetching: isFetchingActive,
    error: activeOrdersError,
    refetch: refetchActiveOrders
  } = useQuery({
    queryKey: ['activeOrders', filters],
    queryFn: async () => {
      const response = await ordersService.getOrders(
        {
          status: Array.isArray(activeStatuses) ? (activeStatuses as OrderStatus[]) : [activeStatuses],
          search: filters.search
        },
        { page: 1, limit: 50 }
      )
      return response.data
    },
    enabled: filters.status === 'all' || ACTIVE_STATUS.includes(filters.status)
  })

  const completedStatuses = filters.status === 'all' ? COMPLETED_STATUS : filters.status
  const {
    data: completedOrdersData,
    isLoading: isLoadingCompleted,
    isFetching: isFetchingCompleted,
    error: completedOrdersError,
    refetch: refetchCompletedOrders
  } = useQuery({
    queryKey: ['completedOrders', filters],
    queryFn: async () => {
      const response = await ordersService.getOrders(
        {
          status: Array.isArray(completedStatuses) ? (completedStatuses as OrderStatus[]) : [completedStatuses],
          search: filters.search
        },
        { page: 1, limit: 50 }
      )
      return response
    },
    enabled: filters.status === 'all' || COMPLETED_STATUS.includes(filters.status)
  })

  // Stats query
  const {
    data: statsData,
    error: statsError,
    isLoading: isStatsLoading
  } = useQuery({
    queryKey: ['ordersStats', filters],
    queryFn: async () => await ordersService.getOrdersStats()
  })

  const activeOrders = activeOrdersData || []
  const completedOrders = completedOrdersData?.data || []
  const completedTotal = completedOrdersData?.total || 0

  const stats = useMemo(
    () =>
      statsData ?? {
        total: 0,
        created: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      },
    [statsData]
  )

  const error = activeOrdersError?.message || completedOrdersError?.message || statsError?.message || ''

  const handleCreateOrderSuccess = () => {
    refetchActiveOrders()
  }

  const refreshAllData = () => {
    refetchActiveOrders()
    refetchCompletedOrders()
  }

  const value: OrdersContextType = {
    activeTab,
    filters,
    handleFiltersChange,
    clearFilters,
    activeOrders,
    completedOrders,
    completedTotal,
    stats,
    isLoadingActive,
    isFetchingActive,
    isLoadingCompleted,
    isFetchingCompleted,
    isStatsLoading,
    error,
    setActiveTab,
    handleCreateOrderSuccess,
    refreshAllData,
    refetchActiveOrders,
    refetchCompletedOrders
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
