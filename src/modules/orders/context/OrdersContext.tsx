'use client'

import { type Order, OrderStatusesGroups, PaginationOptions } from '@/types'
import { keepPreviousData, QueryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ACTIVE_STATUS_GROUPS, COMPLETED_STATUS_GROUPS } from '../constants'
import { ordersService } from '../service/order.service'
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
  refreshAllData: () => void
  completedPagination: PaginationOptions
  setCompletedPagination: (pagination: PaginationOptions) => void
}

export const defaultOrderFilters: OrderFilterProperties = {
  status: 'all',
  search: ''
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [filters, setFilters] = useState<OrderFilterProperties>(defaultOrderFilters)
  const queryClient = useQueryClient()

  const [completedPagination, setCompletedPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 20
  })

  const handleFiltersChange = useCallback((newFilters: OrderFilterProperties) => {
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
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(defaultOrderFilters)
  }, [])

  const statusFilters = useMemo(() => {
    if (filters.status !== 'all') return filters.status

    return activeTab === 'active' ? ACTIVE_STATUS_GROUPS : COMPLETED_STATUS_GROUPS
  }, [filters, activeTab])

  const queryKey: QueryOptions['queryKey'] = useMemo(() => {
    if (activeTab === 'active') {
      return ['orders', activeTab, statusFilters, filters.search]
    }
    return ['orders', activeTab, statusFilters, filters.search, completedPagination]
  }, [statusFilters, filters.search, activeTab, completedPagination])

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery({
    queryKey,
    queryFn: () =>
      ordersService.getOrders(
        { status: statusFilters, search: filters.search },
        activeTab === 'active' ? undefined : { page: completedPagination.page, limit: completedPagination.limit }
      ),
    placeholderData: keepPreviousData
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

  const refreshAllData = useCallback(() => {
    refetchOrders()
    queryClient.invalidateQueries({ queryKey: ['ordersStats'] })
  }, [refetchOrders, queryClient])

  const value: OrdersContextType = useMemo(
    () => ({
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
      refreshAllData,

      completedPagination,
      setCompletedPagination
    }),
    [
      activeTab,
      filters,
      handleFiltersChange,
      clearFilters,
      activeOrders,
      completedOrders,
      ordersData,
      isLoadingOrders,
      isFetchingOrders,
      ordersError,
      setActiveTab,
      refreshAllData,
      completedPagination,
      setCompletedPagination
    ]
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
