import { privateAxiosInstance } from '@/lib/axios'
import { PaginatedResponse, PaginationOptions } from '@/types'
import type { ReportsFilterProperties } from '../components/reports-filters'
import type { ReportRecord } from '../types'

class ReportsService {
  async getReports(
    filters?: ReportsFilterProperties,
    pagination?: PaginationOptions
  ): Promise<PaginatedResponse<ReportRecord>> {
    const params: Record<string, string | Date | number | string[] | undefined> = {
      page: pagination?.page,
      limit: pagination?.limit,
      startdate: filters?.dateRange.from,
      enddate: filters?.dateRange.to
    }

    if (filters?.search && filters?.search?.length > 0) {
      params.search = filters?.search
    }

    if (filters?.status && filters?.status !== 'all') {
      params.status = [filters?.status]
    }

    if (filters?.paymentMethod && filters?.paymentMethod !== 'all') {
      params.paymentType = filters?.paymentMethod
    }

    const { data } = await privateAxiosInstance.get('/reconciliation/report-orders-by-restaurant', {
      params
    })

    const { rows, total } = data
    return {
      data: rows,
      total
    }
  }
}

const reportsService = new ReportsService()

export { reportsService }
