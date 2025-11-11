'use client'

import PageError from '@/components/page-error'
import { PageHeader } from '@/components/page-header'
import { useQuery } from '@tanstack/react-query'
import { BarChart3 } from 'lucide-react'
import { useState } from 'react'
import { ReportsFilters, type ReportsFilterProperties } from './components/reports-filters'
import ReportsStats from './components/reports-stats'
import ReportsTable from './components/reports-table'
import { reportsService } from './service/reportsService'

const defaultFilters: ReportsFilterProperties = {
  search: '',
  status: 'all',
  paymentMethod: 'all',
  dateFrom: undefined,
  dateTo: undefined
}

export default function ReportsView() {
  const [filters, setFilters] = useState<ReportsFilterProperties>(defaultFilters)

  // Fetch reports data with filters
  const {
    data: reportsData = [],
    isLoading: isReportsLoading,
    error: reportsError,
    refetch: refetchReports
  } = useQuery({
    queryKey: ['reports', filters],
    queryFn: () => reportsService.getReports(filters),
    staleTime: 60_000
  })

  // Fetch stats data with filters
  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['reports-stats', filters],
    queryFn: () => reportsService.getReportsStats(filters),
    staleTime: 60_000
  })

  const handleFiltersChange = (newFilters: ReportsFilterProperties) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
  }

  const refreshAllData = () => {
    refetchReports()
    refetchStats()
  }

  const error = reportsError || statsError

  if (error) return <PageError errorMessage='Rapor verileri yüklenirken bir hata oluştu' onRefresh={refreshAllData} />

  return (
    <div className='flex flex-col gap-6 p-6 max-sm:p-0'>
      {/* Sayfa Başlığı */}
      <PageHeader
        title='Raporlar'
        description='Eski siparişlerinizi filtreleyerek detaylı raporlar görüntüleyebilirsiniz'
        icon={BarChart3}
        iconColor='text-purple-400'
      />

      {/* İstatistik Kartları */}
      <ReportsStats
        stats={statsData || { totalOrders: 0, totalRevenue: 0, totalFees: 0, netRevenue: 0 }}
        isLoading={isStatsLoading}
      />

      {/* Filtreler */}
      <ReportsFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />

      {/* Raporlar Tablosu */}
      <ReportsTable data={reportsData} isLoading={isReportsLoading} />
    </div>
  )
}
