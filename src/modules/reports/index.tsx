'use client'

import PageError from '@/components/page-error'
import { getOperationDateRange } from '@/constants'
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

  const {
    data: reportsData = [],
    isLoading: isReportsLoading,
    isFetching: isReportsFetching,
    error: error,
    refetch: refetchReports
  } = useQuery({
    queryKey: ['reports', filters],
    queryFn: () => reportsService.getReports(filters),
    placeholderData: keepPreviousData
  })

  const handleFiltersChange = (newFilters: ReportsFilterProperties) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultReportsFilters)
  }

  if (error)
    return (
      <PageError
        errorMessage='Rapor verileri yüklenirken bir hata oluştu'
        onRefresh={refetchReports}
        isLoading={isReportsFetching}
        title='Rapor Verileri Yüklenemedi'
        description='Rapor verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  return (
    <div className='flex flex-col gap-6 py-6 max-sm:p-0'>
      <ReportsTable
        data={reportsData}
        isLoading={isReportsLoading || isReportsFetching}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        onRefresh={refetchReports}
      />
    </div>
  )
}
