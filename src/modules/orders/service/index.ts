import { delay } from '@/lib/delay'
import { mockOrders } from '@/modules/mockData'
import type {
  ApiResponse,
  FilterOptions,
  Order,
  OrderStatusStats,
  PaginatedResponse,
  PaginationOptions
} from '@/modules/types'

export const ordersService = {
  async getOrders(filters?: FilterOptions, pagination?: PaginationOptions): Promise<PaginatedResponse<Order>> {
    await delay(800)

    let filteredOrders = [...mockOrders]

    // Filtreleme
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        if (Array.isArray(filters.status)) {
          filteredOrders = filteredOrders.filter(order => filters.status!.includes(order.status))
        } else {
          filteredOrders = filteredOrders.filter(order => order.status === filters.status)
        }
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredOrders = filteredOrders.filter(
          order =>
            order.id.toLowerCase().includes(searchLower) || order.customerName.toLowerCase().includes(searchLower)
        )
      }
      if (filters.dateFrom) {
        filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= new Date(filters.dateFrom!))
      }
      if (filters.dateTo) {
        filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) <= new Date(filters.dateTo!))
      }
    }

    // Sayfalama
    const page = pagination?.page || 1
    const limit = pagination?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    return {
      data: paginatedOrders,
      total: filteredOrders.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOrders.length / limit)
    }
  },

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    await delay(600)
    const order = mockOrders.find(o => o.id === id)

    if (!order) {
      return {
        success: false,
        data: {} as Order,
        error: 'Sipariş bulunamadı'
      }
    }

    return {
      success: true,
      data: order
    }
  },

  async getOrdersStats(): Promise<OrderStatusStats> {
    await delay(600)
    return {
      total: mockOrders.length,
      pending: mockOrders.filter(o => o.status === 'pending').length,
      preparing: mockOrders.filter(o => o.status === 'preparing').length,
      prepared: mockOrders.filter(o => o.status === 'prepared').length,
      ready: mockOrders.filter(o => o.status === 'ready').length,
      picked_up: mockOrders.filter(o => o.status === 'picked_up').length,
      on_way: mockOrders.filter(o => o.status === 'on_way').length,
      delivered: mockOrders.filter(o => o.status === 'delivered').length,
      cancelled: mockOrders.filter(o => o.status === 'cancelled').length
    }
  }
}
