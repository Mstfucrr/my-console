'use client'

import { OrderStatusesGroups, type Order } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { ACTIVE_STATUS_GROUPS, COMPLETED_STATUS_GROUPS } from '../constants'
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
  isLoadingActive: boolean
  isFetchingActive: boolean
  isLoadingCompleted: boolean
  isFetchingCompleted: boolean
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
      const isActiveStatus = ACTIVE_STATUS_GROUPS.includes(newFilters.status)
      const isCompletedStatus = COMPLETED_STATUS_GROUPS.includes(newFilters.status)
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

  // Convert filter group to status values
  const activeStatusValues = useMemo(() => {
    if (filters.status === 'all') {
      return ACTIVE_STATUS_GROUPS
    }
    if (ACTIVE_STATUS_GROUPS.includes(filters.status)) {
      return [filters.status as OrderStatusesGroups]
    }
    return []
  }, [filters.status])

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
          status: activeStatusValues,
          search: filters.search
        },
        { page: 1, limit: 50 }
      )
      return response.data
    },
    enabled: filters.status === 'all' || ACTIVE_STATUS_GROUPS.includes(filters.status)
  })

  // Convert filter group to status values
  const completedStatusValues = useMemo(() => {
    if (filters.status === 'all') {
      return COMPLETED_STATUS_GROUPS
    }
    if (COMPLETED_STATUS_GROUPS.includes(filters.status)) {
      return [filters.status as OrderStatusesGroups]
    }
    return []
  }, [filters.status])

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
          status: completedStatusValues,
          search: filters.search
        },
        { page: 1, limit: 50 }
      )
      return response
    },
    enabled: filters.status === 'all' || COMPLETED_STATUS_GROUPS.includes(filters.status)
  })

  const activeOrders = activeOrdersData || []
  const completedOrders = completedOrdersData?.data || []
  const completedTotal = completedOrdersData?.total || 0

  const error = activeOrdersError?.message || completedOrdersError?.message || ''

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
    isLoadingActive,
    isFetchingActive,
    isLoadingCompleted,
    isFetchingCompleted,
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
