import type { DateRange } from 'react-day-picker'
import { mockDashboardStats } from '../data'
import type { DashboardStats } from '../types'

class DashboardService {
  async getStats(dateRange: DateRange | undefined): Promise<DashboardStats> {
    // Simulated API: return a single source of truth after 2000ms
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('dateRange', dateRange)
    // In a real implementation, you would use the dateRange to filter data
    // For now, we'll return mock data regardless of the date range
    return mockDashboardStats
  }
}

export const dashboardService = new DashboardService()
