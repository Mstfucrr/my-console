import { privateAxiosInstance } from '@/lib/axios'
import { formatDateForApi } from '@/lib/utils/date'
import { LatestOrder, OrderStatusStats } from '@/types'
import { DateRange } from 'react-day-picker'

class DashboardService {
  async getStats(dateRange?: DateRange): Promise<OrderStatusStats> {
    const { data } = await privateAxiosInstance.get('/dashboard/order-stats', {
      params: {
        startDate: formatDateForApi(dateRange?.from),
        endDate: formatDateForApi(dateRange?.to)
      }
    })
    return data
  }

  async getLatestOrders(dateRange?: DateRange): Promise<Array<LatestOrder>> {
    const { data } = await privateAxiosInstance.get('/dashboard/latest-orders', {
      params: {
        startDate: formatDateForApi(dateRange?.from),
        endDate: formatDateForApi(dateRange?.to)
      }
    })
    return data.orders
  }
}

export const dashboardService = new DashboardService()
