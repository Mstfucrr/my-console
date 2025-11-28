import { getOperationDateRange } from '@/constants'
import { privateAxiosInstance } from '@/lib/axios/instances'
import type { FilterOptions, Order, OrderStatusStats, PaginatedResponse, PaginationOptions } from '@/types'
import type { OrderDetailResponse, OrderListResponse, OrderStatsResponse } from '../types/api'

export const ordersService = {
  async getOrders(filters?: FilterOptions, pagination?: PaginationOptions): Promise<PaginatedResponse<Order>> {
    const page = pagination?.page
    const limit = pagination?.limit
    const { startDate, endDate } = getOperationDateRange()
    // Backend'e gönderilecek query parametreleri
    const params: Record<string, string | number | string[] | undefined> = {
      page,
      limit,
      startDate,
      endDate
    }

    // Status filtresi: Backend artık array kabul ediyor
    if (filters?.status && filters.status !== 'all') {
      if (Array.isArray(filters.status)) {
        // Backend array kabul ediyor, direkt gönder
        params.status = filters.status
      } else {
        params.status = [filters.status]
      }
    }

    // Search filtresi
    if (filters?.search) {
      params.search = filters.search
    }

    const response = await privateAxiosInstance.get<OrderListResponse>('/orders/order-list', { params })

    const { orders, total } = response.data
    return {
      data: orders,
      total
    }
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await privateAxiosInstance.get<OrderDetailResponse>(`/orders/order/${id}`)
    return response.data
  },

  async getOrdersStats(): Promise<OrderStatusStats> {
    const { startDate, endDate } = getOperationDateRange()
    const params: Record<string, string> = {
      startDate,
      endDate
    }

    const { data } = await privateAxiosInstance.get<OrderStatsResponse>('/dashboard/order-stats', { params })
    return data
  }
}
