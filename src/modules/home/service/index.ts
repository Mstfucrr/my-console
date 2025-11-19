import { privateAxiosInstance } from '@/lib/axios'
import { formatDateForApi } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'
import { mockDashboardStats } from '../data'
import type { DashboardStats } from '../types'

class DashboardService {
  async getStats(dateRange: DateRange | undefined): Promise<DashboardStats> {
    // Simulated API: return a single source of truth after 2000ms
    return mockDashboardStats
    const response = await privateAxiosInstance.get('/dashboard/order-stats', {
      params: {
        startDate: formatDateForApi(dateRange?.from),
        endDate: formatDateForApi(dateRange?.to)
      }
    })
    console.log('response', response)
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('dateRange', dateRange)
    // In a real implementation, you would use the dateRange to filter data
    // For now, we'll return mock data regardless of the date range
  }
}

export const dashboardService = new DashboardService()
