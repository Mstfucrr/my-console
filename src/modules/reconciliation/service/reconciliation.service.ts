import { privateAxiosInstance } from '@/lib/axios'
import { formatDateToApiString } from '@/lib/utils/date'
import { PaginatedResponse, PaginationOptions } from '@/types'
import { ColumnSort } from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import { ReconciliationConfirmStatus, ReconciliationRecordResponse, type ReconciliationRecord } from '../types'

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

class ReconciliationService {
  async getReconciliationData(
    dateRange?: DateRange,
    pagination?: PaginationOptions,
    sort?: ColumnSort
  ): Promise<PaginatedResponse<ReconciliationRecord>> {
    const params: Record<string, string | number | string[] | undefined> = {
      page: pagination?.page,
      limit: pagination?.limit,
      startDate: formatDateToApiString(dateRange?.from),
      endDate: formatDateToApiString(dateRange?.to)
    }
    if (sort?.id) {
      params.sortBy = sort.id
      params.sortDirection = sort.desc ? 'DESC' : 'ASC'
    }
    const { data } = await privateAxiosInstance.get<ReconciliationRecordResponse>('/reconciliation/report-by-company', {
      params
    })
    return {
      data: data.rows,
      total: data.total
    }
  }

  async uploadFile(file: File): Promise<{ url: string }> {
    const fileBuffer = await fileToBase64(file)
    const { data } = await privateAxiosInstance.post<{ statusCode: number; message: string; url: string }>(
      '/reconciliation/upload-s3',
      {
        fileName: file.name,
        fileBuffer,
        mimetype: file.type
      }
    )
    return { url: data.url }
  }

  async approveReconciliation(
    recordId: string,
    confirmRecordId: string | undefined,
    fileName?: string
  ): Promise<{ message: string; affectedRows: number }> {
    const payload = {
      recordID: parseInt(recordId, 10),
      confirmRecordID: confirmRecordId ? parseInt(confirmRecordId, 10) : 0,
      confirmStatus: ReconciliationConfirmStatus.APPROVED,
      fileName: fileName
    }

    const { data } = await privateAxiosInstance.post<{ message: string; affectedRows: number }>(
      '/reconciliation/confirmation-process',
      payload
    )
    return data
  }

  async reportIssue(
    recordId: string,
    confirmRecordId: string | undefined,
    description: string,
    fileName?: string
  ): Promise<{ message: string; affectedRows: number }> {
    const payload = {
      recordID: parseInt(recordId, 10),
      confirmRecordID: confirmRecordId ? parseInt(confirmRecordId, 10) : 0,
      confirmStatus: ReconciliationConfirmStatus.FAILED,
      note: description,
      fileName: fileName
    }

    const { data } = await privateAxiosInstance.post<{ message: string; affectedRows: number }>(
      '/reconciliation/confirmation-process',
      payload
    )
    return data
  }
}

const reconciliationService = new ReconciliationService()

export { reconciliationService }
