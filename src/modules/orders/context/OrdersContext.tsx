'use client'

import type { Order, OrderStatus, PaginationOptions } from '@/modules/types'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { ordersService } from '../service'

export interface OrdersContextType {
  // State
  selectedOrder: Order | null
  isModalVisible: boolean
  isCreateModalVisible: boolean
  completedPagination: PaginationOptions
  activeTab: string
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
  setActiveTab: (tab: string) => void
  setStatusFilter: (filter: OrderStatus[] | null) => void
  setSearchTerm: (term: string) => void

  // Event handlers
  handleViewDetails: (order: Order) => void
  handleCloseModal: () => void
  handleCompletedPageChange: (page: number) => void
  handleCompletedPageClick: (page: number) => void
  handleCreateOrderSuccess: () => void
  refreshAllData: () => void
  handleStatClick: (statuses: OrderStatus[]) => void
  clearFilter: () => void
  filterOrdersBySearch: (orders: Order[]) => Order[]
  handleOrderStatusUpdate: (orderId: string, newStatus: OrderStatus) => Promise<void>
  handleCancelOrder: (orderId: string) => Promise<void>

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
  const [activeTab, setActiveTab] = useState('active')
  const [statusFilter, setStatusFilter] = useState<OrderStatus[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Active orders query
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
          status: statusFilter || ['created', 'shipped'],
          search: searchTerm
        },
        { page: 1, limit: 50 }
      )
      return response.data
    }
  })

  // Completed orders query
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
        { status: statusFilter || ['delivered', 'cancelled'], search: searchTerm },
        completedPagination
      )
      return response
    }
  })

  // Stats query
  const {
    data: statsData,
    error: statsError,
    isLoading: isStatsLoading
  } = useQuery({
    queryKey: ['ordersStats', statusFilter, searchTerm],
    queryFn: async () => {
      const response = await ordersService.getOrdersStats()

      return response
    }
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

  // Handle stat card clicks for filtering
  const handleStatClick = (statuses: OrderStatus[]) => {
    setStatusFilter(statuses)
    // Determine which tab to show based on statuses
    const isActiveStatus = statuses.some(s => ['created', 'shipped'].includes(s))
    const isCompletedStatus = statuses.some(s => ['delivered', 'cancelled'].includes(s))

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

  // Handle order status updates
  const handleOrderStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // TODO: API call to update order status
      console.log(`Updating order ${orderId} to status ${newStatus}`)

      // Refresh the affected tabs
      refreshAllData()
    } catch (err) {
      console.error('Error updating order status:', err)
    }
  }

  // Cancel pending order
  const handleCancelOrder = async (orderId: string) => {
    await handleOrderStatusUpdate(orderId, 'cancelled')
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
    setSearchTerm,

    // Event handlers
    handleViewDetails,
    handleCloseModal,
    handleCompletedPageChange,
    handleCompletedPageClick,
    handleCreateOrderSuccess,
    refreshAllData,
    handleStatClick,
    clearFilter,
    filterOrdersBySearch,
    handleOrderStatusUpdate,
    handleCancelOrder,

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
