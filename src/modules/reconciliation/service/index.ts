import { mockReconciliationData } from '../data/mock-data'
import type { ReconciliationRecord, ReconciliationStats } from '../types'

export interface ReconciliationFilterProperties {
  status: string
  search: string
  dateFrom?: string
  dateTo?: string
}

export const reconciliationService = {
  async getReconciliationData(filters?: ReconciliationFilterProperties): Promise<ReconciliationRecord[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    let filteredData = [...mockReconciliationData]

    // Apply search filter
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filteredData = filteredData.filter(
        item => item.id.toLowerCase().includes(search) || item.paymentMethod.toLowerCase().includes(search)
      )
    }

    // Apply status filter
    if (filters?.status && filters.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === filters.status)
    }

    // Apply date range filters
    if (filters?.dateFrom) {
      filteredData = filteredData.filter(item => item.date >= filters.dateFrom!)
    }

    if (filters?.dateTo) {
      filteredData = filteredData.filter(item => item.date <= filters.dateTo!)
    }

    return filteredData
  },

  async getReconciliationStats(filters?: ReconciliationFilterProperties): Promise<ReconciliationStats> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Get filtered data for accurate stats
    const data = await this.getReconciliationData(filters)

    return {
      totalSettled: data.filter(item => item.status === 'completed').length,
      totalPending: data.filter(item => item.status === 'pending').length,
      totalFailed: data.filter(item => item.status === 'failed').length,
      monthlyRevenue: data.reduce((sum, item) => sum + item.totalAmount, 0),
      platformFees: data.reduce((sum, item) => sum + item.platformFee, 0),
      netRevenue: data.reduce((sum, item) => sum + item.netAmount, 0)
    }
  },

  async exportReconciliationReport(dateRange?: { from: Date; to: Date }): Promise<void> {
    // Simulate export functionality
    console.log('Exporting reconciliation report', dateRange)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
