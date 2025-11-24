'use client'

import PageError from '@/components/page-error'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { type ReportsFilterProperties } from './components/reports-filters'
import ReportsStats from './components/reports-stats'
import ReportsTable from './components/reports-table'
import { reportsService } from './service/reportsService'

export const defaultReportsFilters: ReportsFilterProperties = {
  search: '',
  status: 'all',
  paymentMethod: 'all',
  dateRange: {
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  }
}

export default function ReportsView() {
  const [filters, setFilters] = useState<ReportsFilterProperties>(defaultReportsFilters)

  // Fetch reports data with filters
  const {
    data: reportsData = [],
    isLoading: isReportsLoading,
    isFetching: isReportsFetching,
    error: reportsError,
    refetch: refetchReports
  } = useQuery({
    queryKey: ['reports', filters],
    queryFn: () => reportsService.getReports(filters)
  })

  // Fetch stats data with filters
  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['reports-stats', filters],
    queryFn: () => reportsService.getReportsStats(filters)
  })

  const handleFiltersChange = (newFilters: ReportsFilterProperties) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultReportsFilters)
  }

  const refreshAllData = () => {
    refetchReports()
    refetchStats()
  }

  const error = reportsError || statsError

  if (error)
    return (
      <PageError
        errorMessage='Rapor verileri yüklenirken bir hata oluştu'
        onRefresh={refreshAllData}
        isLoading={isReportsFetching || isStatsLoading}
        title='Rapor Verileri Yüklenemedi'
        description='Rapor verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  return (
    <div className='flex flex-col gap-6 py-6 max-sm:p-0'>
      {/* Sayfa Başlığı */}

      {/* İstatistik Kartları */}
      <ReportsStats
        stats={statsData || { totalOrders: 0, totalRevenue: 0, totalFees: 0, netRevenue: 0 }}
        isLoading={isStatsLoading}
      />

      {/* Raporlar Tablosu */}
      <ReportsTable
        data={reportsData}
        isLoading={isReportsLoading || isReportsFetching}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        onRefresh={refreshAllData}
      />
    </div>
  )
}
