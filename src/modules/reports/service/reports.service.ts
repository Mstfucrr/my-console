import { privateAxiosInstance } from '@/lib/axios'
import type { ReportsFilterProperties } from '../components/reports-filters'
import type { ReportRecord } from '../types'

export const reportsService = {
  async getReports(filters?: ReportsFilterProperties): Promise<Array<ReportRecord>> {
    const dateFrom = filters?.dateRange.from
    const dateTo = filters?.dateRange.to

    const ordersResponse = await privateAxiosInstance.get('/reconciliation/report-orders-by-restaurant', {
      params: {
        startdate: dateFrom,
        enddate: dateTo
      }
    })

    return ordersResponse.data.rows
  }
}
