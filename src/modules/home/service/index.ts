import { dashboardMockData } from '../data'
import type { DashboardStats } from '../types'

class DashboardService {
  async getStats(_dateRange: 'today' | 'week' | 'month' = 'today'): Promise<DashboardStats> {
    void _dateRange
    // Simulated API: return a single source of truth after 2000ms
    await new Promise(resolve => setTimeout(resolve, 1000))
    return dashboardMockData
  }
}

export const dashboardService = new DashboardService()
