import type { ReconciliationRecord, ReconciliationStats } from '../types'
import { mockReconciliationData, mockStats } from '../data/mock-data'

export const reconciliationService = {
  async getReconciliationData(): Promise<ReconciliationRecord[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockReconciliationData
  },

  async getReconciliationStats(): Promise<ReconciliationStats> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockStats
  },

  async exportReconciliationReport(dateRange?: { from: Date; to: Date }): Promise<void> {
    // Simulate export functionality
    console.log('Exporting reconciliation report', dateRange)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
