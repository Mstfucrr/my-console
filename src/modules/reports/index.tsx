'use client'

import PageError from '@/components/page-error'
import { getOperationDateRange } from '@/constants'
import { PaginationOptions } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { type ReportsFilterProperties } from './components/reports-filters'
import ReportsTable from './components/reports-table'
import { reportsService } from './service/reports.service'

export const defaultReportsFilters: ReportsFilterProperties = {
  search: '',
  status: 'all',
  paymentMethod: 'all',
  dateRange: {
    from: new Date(getOperationDateRange().startDate),
    to: new Date(getOperationDateRange().endDate)
  }
}

export default function ReportsView() {
  const [filters, setFilters] = useState<ReportsFilterProperties>(defaultReportsFilters)

  const [reportsPagination, setReportsPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 20
  })

  const handleReportsPageSizeChange = (size: number) => {
    setReportsPagination({ ...reportsPagination, limit: size })
  }

  const handleReportsPageChange = (page: number) => {
    setReportsPagination({ ...reportsPagination, page })
  }

  const {
    data: reportsData,
    isLoading: isReportsLoading,
    isFetching: isReportsFetching,
    error: error,
    refetch: refetchReports
  } = useQuery({
    queryKey: ['reports', filters, reportsPagination],
    queryFn: () => reportsService.getReports(filters, reportsPagination),
    placeholderData: keepPreviousData
  })

  const handleFiltersChange = (newFilters: ReportsFilterProperties) => {
    setFilters(newFilters)
  }

  const handleRefresh = () => {
    setReportsPagination({ ...reportsPagination, page: 1 })
    setFilters(defaultReportsFilters)
    refetchReports()
  }

  const handleClearFilters = () => {
    setFilters(defaultReportsFilters)
  }

  if (error)
    return (
      <PageError
        errorMessage='Rapor verileri yüklenirken bir hata oluştu'
        onRefresh={handleRefresh}
        isLoading={isReportsFetching}
        title='Rapor Verileri Yüklenemedi'
        description='Rapor verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  return (
    <div className='flex flex-col gap-4 py-6 max-sm:p-0'>
      <ReportsTable
        data={reportsData?.data || []}
        isLoading={isReportsLoading || isReportsFetching}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        onRefresh={refetchReports}
        onPageChange={handleReportsPageChange}
        page={reportsPagination.page}
        pageSize={reportsPagination.limit}
        total={reportsData?.total}
        onPageSizeChange={handleReportsPageSizeChange}
      />
    </div>
  )
}
