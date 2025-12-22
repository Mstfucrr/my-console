import { getOperationDateRange } from '@/constants'
import { privateAxiosInstance } from '@/lib/axios/instances'
import type {
  CourierTrackResponse,
  Order,
  OrderStatusStats,
  OrderStatusesGroups,
  PaginatedResponse,
  PaginationOptions
} from '@/types'
import { CreateOrderFormData } from '../create/types'
import type { OrderDetailResponse, OrderListResponse, OrderStatsResponse } from '../types/api'

// Filtreleme ve Sayfalama
export interface FilterOptions {
  status?: OrderStatusesGroups | Array<OrderStatusesGroups> | 'all'
  dateFrom?: string
  dateTo?: string
  search?: string
}

class OrdersService {
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
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await privateAxiosInstance.get<OrderDetailResponse>(`/orders/order/${id}`)
    return response.data
  }

  async getOrdersStats(): Promise<OrderStatusStats> {
    const { startDate, endDate } = getOperationDateRange()
    const params: Record<string, string> = {
      startDate,
      endDate
    }

    const { data } = await privateAxiosInstance.get<OrderStatsResponse>('/dashboard/order-stats', { params })
    return data
  }

  async createOrder(order: CreateOrderFormData): Promise<Order> {
    // Form'daki obje yapısını backend'in beklediği string formatına çevir
    const payload = {
      ...order,
      preparationTime: 7, // Önyüzde hazırlık süresi 7 dakika olarak default değerlendiriliyor.
      district: undefined,
      dontRingDoorBell: undefined,
      city: order.city.name,
      county: order.county.name,
      neighborhood: order.district.name,
      totalAmount: Number(order.totalAmount) * 100,
      street: order.street,
      ringDoorBell: !order.dontRingDoorBell
    }
    const response = await privateAxiosInstance.post<Order>('/orders/create', payload)
    return response.data
  }

  async courierTrack(orderSId: string): Promise<CourierTrackResponse> {
    return await privateAxiosInstance.get<CourierTrackResponse>(`/location/carrier/${orderSId}`).then(res => res.data)
  }
}

const ordersService = new OrdersService()

export { ordersService }
