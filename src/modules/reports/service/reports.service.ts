import { privateAxiosInstance } from '@/lib/axios'
import { formatDateToApiString } from '@/lib/utils/date'
import { PaginatedResponse, PaginationOptions } from '@/types'
import { ColumnSort } from '@tanstack/react-table'
import type { ReportsFilterProperties } from '../components/reports-filters'
import type { ReportRecord, SendEmailResponse } from '../types'

function buildReportParams(
  filters?: ReportsFilterProperties,
  options?: { pagination?: PaginationOptions; sort?: ColumnSort }
) {
  const params: Record<string, string | number | string[] | undefined> = {}

  // Pagination
  if (options?.pagination) {
    params.page = options.pagination.page
    params.limit = options.pagination.limit
  }

  // Date Range
  params.startdate = formatDateToApiString(filters?.dateRange.from)
  params.enddate = formatDateToApiString(filters?.dateRange.to)

  // Sorting
  if (options?.sort?.id) {
    params.sortBy = options.sort.id
    params.sortDirection = options.sort.desc ? 'DESC' : 'ASC'
  }

  // Search
  if (filters?.search && filters?.search.length > 0) {
    params.search = filters.search
  }

  // Status
  if (filters?.status && filters.status !== 'all') {
    params.status = [filters.status]
  }

  // Payment Method
  if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
    params.paymentTypeId = [filters.paymentMethod]
  }

  return params
}

class ReportsService {
  async getReports(
    filters?: ReportsFilterProperties,
    pagination?: PaginationOptions,
    sort?: ColumnSort
  ): Promise<PaginatedResponse<ReportRecord>> {
    const params = buildReportParams(filters, { pagination, sort })
    const { data } = await privateAxiosInstance.get('/reconciliation/report-orders-by-restaurant', {
      params
    })

    const { rows, total } = data
    return {
      data: rows,
      total
    }
  }

  async sendEmail(filters?: ReportsFilterProperties, sort?: ColumnSort): Promise<SendEmailResponse> {
    const params = buildReportParams(filters, { sort })
    const { data } = await privateAxiosInstance.post<SendEmailResponse>(
      '/reconciliation/report-orders-by-restaurant/email',
      params
    )
    return data
  }
}

const reportsService = new ReportsService()

export { reportsService }
