import { mockReconciliationData } from '../data/mock-data'
import type { ReconciliationFilterProperties, ReconciliationRecord, ReconciliationStats } from '../types'

export const reconciliationService = {
  async getReconciliationData(filters?: ReconciliationFilterProperties): Promise<ReconciliationRecord[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    let filteredData = [...mockReconciliationData]

    // Apply status filter
    if (filters?.status && filters.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === filters.status)
    }

    return filteredData
  },

  async getReconciliationStats(filters?: ReconciliationFilterProperties): Promise<ReconciliationStats> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Get filtered data for accurate stats
    const data = await this.getReconciliationData(filters)

    return {
      totalApproved: data.filter(item => item.status === 'approved').length,
      totalPending: data.filter(item => item.status === 'pending').length,
      totalFailed: data.filter(item => item.status === 'problematic').length,
      monthlyRevenue: data.reduce((sum, item) => sum + item.totalOrderAmount, 0),
      platformFees: data.reduce((sum, item) => sum + item.ataExpressDeliveryInvoice, 0),
      netRevenue: data.reduce((sum, item) => sum + item.netAmount, 0)
    }
  },

  async exportReconciliationReport(dateRange?: { from: Date; to: Date }): Promise<void> {
    // Simulate export functionality
    console.log('Exporting reconciliation report', dateRange)
    await new Promise(resolve => setTimeout(resolve, 1000))
  },

  async uploadInvoice(recordId: string, file: File): Promise<{ success: boolean; invoiceUrl?: string }> {
    // Simulate file upload
    console.log(`Uploading file ${file.name} for record ${recordId}`)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate successful upload
    return {
      success: true,
      invoiceUrl: `/invoices/${recordId}.pdf`
    }
  },

  async uploadCurrentAccountStatement(recordId: string, file: File): Promise<{ success: boolean; fileUrl?: string }> {
    // Simulate file upload
    console.log(`Uploading current account statement file ${file.name} for record ${recordId}`)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate successful upload
    return {
      success: true,
      fileUrl: `/statements/${recordId}.pdf`
    }
  },

  async approveReconciliation(recordId: string): Promise<{ success: boolean }> {
    // Simulate approval process
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Update the record status in mock data
    const recordIndex = mockReconciliationData.findIndex(record => record.id === recordId)
    if (recordIndex !== -1) {
      mockReconciliationData[recordIndex].status = 'approved'
    }

    return { success: true }
  },

  async reportIssue(recordId: string, issueDescription: string, statementFile?: File): Promise<{ success: boolean }> {
    // Simulate issue reporting
    console.log(`Reporting issue for record ${recordId}: ${issueDescription}`)
    if (statementFile) {
      console.log(`Uploading current account statement file: ${statementFile.name}`)
    }
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update the record status in mock data
    const recordIndex = mockReconciliationData.findIndex(record => record.id === recordId)
    if (recordIndex !== -1) {
      mockReconciliationData[recordIndex].status = 'problematic'
    }

    return { success: true }
  }
}
