'use client'

import { type Order, OrderStatusesGroups } from '@/types'
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
  activeOrders: Array<Order> | undefined
  completedOrders: Array<Order> | undefined
  total: number
  isLoading: boolean
  isFetching: boolean
  error: string
  setActiveTab: (tab: 'active' | 'completed') => void
  handleCreateOrderSuccess: () => void
  refreshAllData: () => void
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
      const statusValue = Array.isArray(newFilters.status) ? newFilters.status[0] : newFilters.status
      const isActiveStatus = ACTIVE_STATUS_GROUPS.includes(statusValue as OrderStatusesGroups)
      const isCompletedStatus = COMPLETED_STATUS_GROUPS.includes(statusValue as OrderStatusesGroups)
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

  const statusFilters = useMemo(() => {
    if (filters.status !== 'all') {
      return filters.status
    }
    return activeTab === 'active' ? ACTIVE_STATUS_GROUPS : COMPLETED_STATUS_GROUPS
  }, [filters, activeTab])

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery({
    queryKey: ['orders', statusFilters, filters.search, activeTab],
    queryFn: async () => {
      const response = await ordersService.getOrders(
        { status: statusFilters, search: filters.search },
        { page: 1, limit: 50 }
      )
      return response
    }
  })

  // Active orders - direkt backend'den gelen data
  const activeOrders = useMemo(
    () => ordersData?.data.filter(order => ACTIVE_STATUS_GROUPS.includes(order.status)) || [],
    [ordersData]
  )

  // Completed orders - direkt backend'den gelen data
  const completedOrders = useMemo(
    () => ordersData?.data.filter(order => COMPLETED_STATUS_GROUPS.includes(order.status)) || [],
    [ordersData]
  )

  const handleCreateOrderSuccess = () => {
    refetchOrders()
  }

  const refreshAllData = () => {
    refetchOrders()
  }

  const value: OrdersContextType = {
    activeTab,
    filters,
    handleFiltersChange,
    clearFilters,
    activeOrders,
    completedOrders,
    total: ordersData?.total || 0,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
    error: ordersError?.message || '',
    setActiveTab,
    handleCreateOrderSuccess,
    refreshAllData
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
