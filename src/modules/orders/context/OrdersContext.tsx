'use client'

import { type Order, OrderStatusesGroups, PaginationOptions } from '@/types'
import { keepPreviousData, QueryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnSort } from '@tanstack/react-table'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ACTIVE_ORDER_STATUS_GROUPS, COMPLETED_ORDER_STATUS_GROUPS } from '../constants'
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
  onPageSizeChange: (size: number) => void
  sorting: ColumnSort
  setSorting: (sorting: ColumnSort) => void
}

export const defaultOrderFilters: OrderFilterProperties = {
  status: 'all',
  search: ''
}

export const defaultPagination: PaginationOptions = {
  page: 1,
  limit: 20
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

const defaultSort: ColumnSort = { id: 'createdAt', desc: true }

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('active')
  const [filters, setFilters] = useState<OrderFilterProperties>(defaultOrderFilters)
  const queryClient = useQueryClient()

  const [pagination, setPagination] = useState<PaginationOptions>(defaultPagination)
  const [sorting, setSorting] = useState<ColumnSort>(defaultSort)

  const handleSetActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTab(tab)
    setPagination(defaultPagination)
    setSorting(defaultSort)
  }, [])

  const handleFiltersChange = useCallback(
    (newFilters: OrderFilterProperties) => {
      setFilters(newFilters)
      // Auto-switch tab based on status
      if (newFilters.status !== 'all') {
        const statusValue = Array.isArray(newFilters.status) ? newFilters.status[0] : newFilters.status
        const isActiveStatus = ACTIVE_ORDER_STATUS_GROUPS.includes(statusValue as OrderStatusesGroups)
        const isCompletedStatus = COMPLETED_ORDER_STATUS_GROUPS.includes(statusValue as OrderStatusesGroups)
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

  const handlePageSizeChange = useCallback((size: number) => {
    setPagination({ page: 1, limit: size })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(defaultOrderFilters)
  }, [])

  const statusFilters = useMemo(() => {
    if (filters.status !== 'all') return filters.status

    return activeTab === 'active' ? ACTIVE_ORDER_STATUS_GROUPS : COMPLETED_ORDER_STATUS_GROUPS
  }, [filters, activeTab])

  const queryKey: QueryOptions['queryKey'] = useMemo(() => {
    return ['orders', activeTab, statusFilters, filters.search, pagination, sorting]
  }, [activeTab, statusFilters, filters.search, pagination, sorting])

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery({
    queryKey,
    queryFn: () => ordersService.getOrders({ status: statusFilters, search: filters.search }, pagination, sorting),
    placeholderData: keepPreviousData,
    staleTime: 10 * 1000 // 10 saniye
  })

  // Active orders - direkt backend'den gelen data
  const activeOrders = useMemo(
    () => ordersData?.data?.filter(order => ACTIVE_ORDER_STATUS_GROUPS.includes(order.status)) || [],
    [ordersData]
  )

  // Completed orders - direkt backend'den gelen data
  const completedOrders = useMemo(
    () => ordersData?.data?.filter(order => COMPLETED_ORDER_STATUS_GROUPS.includes(order.status)) || [],
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
      setPagination,
      onPageSizeChange: handlePageSizeChange,
      sorting,
      setSorting
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
      setPagination,
      handlePageSizeChange,
      sorting
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
