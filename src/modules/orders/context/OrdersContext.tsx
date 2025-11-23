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

  // Active orders query - ACTIVE_STATUS_GROUPS array olarak gönderiliyor
  // Sadece active tab seçiliyse çalışır
  const {
    data: activeOrdersData,
    isLoading: isLoadingActive,
    isFetching: isFetchingActive,
    error: activeOrdersError,
    refetch: refetchActiveOrders
  } = useQuery({
    queryKey: ['orders', 'active', ACTIVE_STATUS_GROUPS, filters.search],
    queryFn: async () => {
      const response = await ordersService.getOrders(
        {
          status: ACTIVE_STATUS_GROUPS,
          search: filters.search
        },
        { page: 1, limit: 50 }
      )
      return response
    },
    enabled: activeTab === 'active'
  })

  // Completed orders query - COMPLETED_STATUS_GROUPS array olarak gönderiliyor
  // Sadece completed tab seçiliyse çalışır
  const {
    data: completedOrdersData,
    isLoading: isLoadingCompleted,
    isFetching: isFetchingCompleted,
    error: completedOrdersError,
    refetch: refetchCompletedOrders
  } = useQuery({
    queryKey: ['orders', 'completed', COMPLETED_STATUS_GROUPS, filters.search],
    queryFn: async () => {
      const response = await ordersService.getOrders(
        {
          status: COMPLETED_STATUS_GROUPS,
          search: filters.search
        },
        { page: 1, limit: 50 }
      )
      return response
    },
    enabled: activeTab === 'completed'
  })

  // Active orders - direkt backend'den gelen data
  const activeOrders = useMemo(() => activeOrdersData?.data || [], [activeOrdersData])

  // Completed orders - direkt backend'den gelen data
  const completedOrders = useMemo(() => completedOrdersData?.data || [], [completedOrdersData])

  // Completed total
  const completedTotal = useMemo(() => completedOrdersData?.total || 0, [completedOrdersData?.total])

  // Error handling
  const error = useMemo(() => {
    if (activeTab === 'active') return activeOrdersError?.message || ''
    if (activeTab === 'completed') return completedOrdersError?.message || ''
    return ''
  }, [activeTab, activeOrdersError, completedOrdersError])

  const handleCreateOrderSuccess = () => {
    refetchActiveOrders()
    refetchCompletedOrders()
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
