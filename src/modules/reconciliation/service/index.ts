import { privateAxiosInstance } from '@/lib/axios'
import {
  ReconciliationConfirmStatus,
  ReconciliationRecordResponse,
  type ReconciliationFilterProperties,
  type ReconciliationRecord,
  type ReconciliationStats
} from '../types'

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

export const reconciliationService = {
  async getReconciliationData(filters?: ReconciliationFilterProperties): Promise<ReconciliationRecord[]> {
    const confirmStatus = filters?.status === 'all' ? undefined : filters?.status
    const response = await privateAxiosInstance.get<ReconciliationRecordResponse>('/reconciliation/report-by-company', {
      params: {
        confirmStatus: confirmStatus
      }
    })
    // Map RecordID to id for table component compatibility
    return response.data.rows.map(record => ({
      ...record,
      id: record.RecordID
    }))
  },

  async getReconciliationStats(): Promise<ReconciliationStats> {
    const response = await privateAxiosInstance.get<ReconciliationStats>('/reconciliation/stats')

    const data = response.data
    return {
      paidAmount: data.paidAmount,
      pendingPayment: data.pendingPayment,
      totalTurnover: data.totalTurnover
    }
  },

  async exportReconciliationReport(dateRange?: { from: Date; to: Date }): Promise<void> {
    // Simulate export functionality
    console.log('Exporting reconciliation report', dateRange)
    await new Promise(resolve => setTimeout(resolve, 1000))
  },

  async uploadFile(file: File): Promise<{ url: string }> {
    const fileBuffer = await fileToBase64(file)
    const response = await privateAxiosInstance.post<{ statusCode: number; message: string; url: string }>(
      '/reconciliation/upload-s3',
      {
        fileName: file.name,
        fileBuffer,
        mimetype: file.type
      }
    )
    return { url: response.data.url }
  },

  async approveReconciliation(
    recordId: string,
    confirmRecordId: string | undefined,
    fileName?: string
  ): Promise<{ message: string; affectedRows: number }> {
    const response = await privateAxiosInstance.post<{ message: string; affectedRows: number }>(
      '/reconciliation/confirmation-process',
      {
        recordID: parseInt(recordId, 10),
        confirmRecordID: confirmRecordId ? parseInt(confirmRecordId, 10) : 0,
        confirmStatus: ReconciliationConfirmStatus.APPROVED,
        fileName: fileName || undefined
      }
    )
    return response.data
  },

  async reportIssue(
    recordId: string,
    confirmRecordId: string | undefined,
    description: string,
    fileName?: string
  ): Promise<{ message: string; affectedRows: number }> {
    const response = await privateAxiosInstance.post<{ message: string; affectedRows: number }>(
      '/reconciliation/confirmation-process',
      {
        recordID: parseInt(recordId, 10),
        confirmRecordID: confirmRecordId ? parseInt(confirmRecordId, 10) : 0,
        confirmStatus: ReconciliationConfirmStatus.FAILED,
        note: description,
        fileName: fileName || undefined
      }
    )
    return response.data
  }
}
