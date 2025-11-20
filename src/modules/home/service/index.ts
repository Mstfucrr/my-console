import { privateAxiosInstance } from '@/lib/axios'
import { formatDateForApi } from '@/lib/utils'
import { Order } from '@/modules/types'
import { DateRange } from 'react-day-picker'
import type { DashboardGraphs, DashboardStats } from '../types'

class DashboardService {
  async getStats(dateRange?: DateRange): Promise<DashboardStats> {
    const { data } = await privateAxiosInstance.get('/dashboard/order-stats', {
      params: {
        startDate: formatDateForApi(dateRange?.from),
        endDate: formatDateForApi(dateRange?.to)
      }
    })
    return data
  }

  async getLatestOrders(dateRange?: DateRange): Promise<Order[]> {
    const { data } = await privateAxiosInstance.get('/dashboard/latest-orders', {
      params: {
        startDate: formatDateForApi(dateRange?.from),
        endDate: formatDateForApi(dateRange?.to)
      }
    })
    return data
  }

  async getGraphs(dateRange?: DateRange): Promise<DashboardGraphs> {
    const { data } = await privateAxiosInstance.get('/dashboard/graphs', {
      params: {
        startDate: formatDateForApi(dateRange?.from),
        endDate: formatDateForApi(dateRange?.to)
      }
    })

    if (!data)
      return {
        orderCount: [],
        revenue: [],
        deliveryTime: []
      }

    return {
      orderCount: data['order-count'],
      revenue: data.revenue,
      deliveryTime: data['delivery-time']
    }
  }
}

export const dashboardService = new DashboardService()
