'use client'

import type { Order, OrderStatus, PaginationOptions } from '@/modules/types'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { ACTIVE_STATUS, COMPLETED_STATUS } from '../constants'
import { ordersService } from '../service'

export interface OrdersContextType {
  // State
  selectedOrder: Order | null
  isModalVisible: boolean
  isCreateModalVisible: boolean
  completedPagination: PaginationOptions
  activeTab: 'active' | 'completed'
  statusFilter: OrderStatus[] | null
  searchTerm: string

  // Data
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

  // Loading states
  isLoadingActive: boolean
  isFetchingActive: boolean
  isLoadingCompleted: boolean
  isFetchingCompleted: boolean
  isStatsLoading: boolean
  // Error
  error: string

  // Actions
  setSelectedOrder: (order: Order | null) => void
  setIsModalVisible: (visible: boolean) => void
  setIsCreateModalVisible: (visible: boolean) => void
  setCompletedPagination: (pagination: PaginationOptions) => void
  setActiveTab: (tab: 'active' | 'completed') => void
  setStatusFilter: (filter: OrderStatus[] | null) => void
  handleStatusFilterChange: (statuses: OrderStatus[] | null) => void
  setSearchTerm: (term: string) => void

  // Event handlers
  handleViewDetails: (order: Order) => void
  handleCloseModal: () => void
  handleCompletedPageChange: (page: number) => void
  handleCompletedPageClick: (page: number) => void
  handleCreateOrderSuccess: () => void
  refreshAllData: () => void
  clearFilter: () => void
  filterOrdersBySearch: (orders: Order[]) => Order[]

  // Refetch functions
  refetchActiveOrders: () => void
  refetchCompletedOrders: () => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  // State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [completedPagination, setCompletedPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 6
  })
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [statusFilter, setStatusFilter] = useState<OrderStatus[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Active orders query
  const activeStatuses = statusFilter?.filter(s => ACTIVE_STATUS.includes(s))
  const {
    data: activeOrdersData,
    isLoading: isLoadingActive,
    isFetching: isFetchingActive,
    error: activeOrdersError,
    refetch: refetchActiveOrders
  } = useQuery({
    queryKey: ['activeOrders', statusFilter, searchTerm],
    queryFn: async () => {
      const response = await ordersService.getOrders(
        {
          status: activeStatuses || (ACTIVE_STATUS as OrderStatus[]),
          search: searchTerm
        },
        { page: 1, limit: 50 }
      )
      return response.data
    },
    enabled: statusFilter ? activeStatuses && activeStatuses.length > 0 : true
  })

  // Completed orders query
  const completedStatuses = statusFilter?.filter(s => COMPLETED_STATUS.includes(s))
  const {
    data: completedOrdersData,
    isLoading: isLoadingCompleted,
    isFetching: isFetchingCompleted,
    error: completedOrdersError,
    refetch: refetchCompletedOrders
  } = useQuery({
    queryKey: ['completedOrders', completedPagination.page, completedPagination.limit, statusFilter, searchTerm],
    queryFn: async () => {
      const response = await ordersService.getOrders(
        { status: completedStatuses || (COMPLETED_STATUS as OrderStatus[]), search: searchTerm },
        completedPagination
      )
      return response
    },
    enabled: statusFilter ? completedStatuses && completedStatuses.length > 0 : true
  })

  // Stats query
  const {
    data: statsData,
    error: statsError,
    isLoading: isStatsLoading
  } = useQuery({
    queryKey: ['ordersStats', searchTerm],
    queryFn: async () => await ordersService.getOrdersStats()
  })

  // Extract data with fallbacks
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

  // Combine errors
  const error = activeOrdersError?.message || completedOrdersError?.message || statsError?.message || ''

  // Event handlers
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setSelectedOrder(null)
    setIsModalVisible(false)
  }

  const handleCompletedPageChange = (page: number) => {
    setCompletedPagination(prev => ({ ...prev, page }))
  }

  const handleCompletedPageClick = (page: number) => {
    setCompletedPagination(prev => ({ ...prev, page }))
  }

  const handleCreateOrderSuccess = () => {
    refetchActiveOrders()
  }

  const refreshAllData = () => {
    refetchActiveOrders()
    refetchCompletedOrders()
  }

  // Handle status filter changes
  const handleStatusFilterChange = (statuses: OrderStatus[] | null) => {
    setStatusFilter(statuses)
    // Determine which tab to show based on statuses
    const isActiveStatus = statuses?.some(s => ACTIVE_STATUS.includes(s))
    const isCompletedStatus = statuses?.some(s => COMPLETED_STATUS.includes(s))

    if (isActiveStatus && !isCompletedStatus) {
      setActiveTab('active')
    } else if (isCompletedStatus && !isActiveStatus) {
      setActiveTab('completed')
    }
  }

  // Clear filter
  const clearFilter = () => {
    setStatusFilter(null)
    setSearchTerm('')
  }

  // Search function - filters orders by customer name, phone, order ID
  const filterOrdersBySearch = (orders: Order[]) => {
    if (!searchTerm.trim()) return orders

    const searchLower = searchTerm.toLowerCase().trim()
    return orders.filter(
      order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerPhone.toLowerCase().includes(searchLower) ||
        order.customerAddress.toLowerCase().includes(searchLower)
    )
  }

  const value: OrdersContextType = {
    // State
    selectedOrder,
    isModalVisible,
    isCreateModalVisible,
    completedPagination,
    activeTab,
    statusFilter,
    searchTerm,

    // Data
    activeOrders,
    completedOrders,
    completedTotal,
    stats,

    // Loading states
    isLoadingActive,
    isFetchingActive,
    isLoadingCompleted,
    isFetchingCompleted,
    isStatsLoading,
    // Error
    error,

    // Actions
    setSelectedOrder,
    setIsModalVisible,
    setIsCreateModalVisible,
    setCompletedPagination,
    setActiveTab,
    setStatusFilter,
    handleStatusFilterChange,
    setSearchTerm,

    // Event handlers
    handleViewDetails,
    handleCloseModal,
    handleCompletedPageChange,
    handleCompletedPageClick,
    handleCreateOrderSuccess,
    refreshAllData,
    clearFilter,
    filterOrdersBySearch,

    // Refetch functions
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
