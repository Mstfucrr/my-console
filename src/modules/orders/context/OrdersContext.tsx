'use client'

import { type Order, OrderStatusesGroups, PaginationOptions } from '@/types'
import { keepPreviousData, QueryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ACTIVE_STATUS_GROUPS, COMPLETED_STATUS_GROUPS } from '../constants'
import { ordersService } from '../service/order.service'
import { OrderFilterProperties } from '../types'

export type ActiveTab = 'active' | 'completed'
export interface OrdersContextType {
  activeTab: ActiveTab
  filters: OrderFilterProperties
  handleFiltersChange: (newFilters: OrderFilterProperties) => void
  clearFilters: () => void
  activeOrders: Array<Order> | undefined
  completedOrders: Array<Order> | undefined
  total: number
  isLoading: boolean
  isFetching: boolean
  error: string
  setActiveTab: (tab: ActiveTab) => void
  refreshAllData: () => void
  pagination: PaginationOptions
  setPagination: (pagination: PaginationOptions) => void
}

export const defaultOrderFilters: OrderFilterProperties = {
  status: 'all',
  search: ''
}

export const defaultPagination: PaginationOptions = {
  page: 1,
  limit: 40
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('active')
  const [filters, setFilters] = useState<OrderFilterProperties>(defaultOrderFilters)
  const queryClient = useQueryClient()

  const [pagination, setPagination] = useState<PaginationOptions>(defaultPagination)

  const handleSetActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTab(tab)
    setPagination(defaultPagination)
  }, [])

  const handleFiltersChange = useCallback(
    (newFilters: OrderFilterProperties) => {
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
      if (pagination.page !== defaultPagination.page) setPagination(defaultPagination)
    },
    [pagination.page]
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultOrderFilters)
  }, [])

  const statusFilters = useMemo(() => {
    if (filters.status !== 'all') return filters.status

    return activeTab === 'active' ? ACTIVE_STATUS_GROUPS : COMPLETED_STATUS_GROUPS
  }, [filters, activeTab])

  const queryKey: QueryOptions['queryKey'] = useMemo(() => {
    return ['orders', activeTab, statusFilters, filters.search, pagination]
  }, [activeTab, statusFilters, filters.search, pagination])

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery({
    queryKey,
    queryFn: () => ordersService.getOrders({ status: statusFilters, search: filters.search }, pagination),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000 // 60 saniye
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
      setActiveTab: handleSetActiveTab,
      refreshAllData,
      pagination,
      setPagination
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
      handleSetActiveTab,
      refreshAllData,
      pagination,
      setPagination
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
