'use client'

import PageError from '@/components/page-error'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ReconciliationFilters, type ReconciliationFilterProperties } from './components/reconciliation-filters'
import ReconciliationHeader from './components/reconciliation-header'
import ReconciliationInfoAlert from './components/reconciliation-info-alert'
import ReconciliationStats from './components/reconciliation-stats'
import ReconciliationTable from './components/reconciliation-table'
import { reconciliationService } from './service'

const defaultFilters: ReconciliationFilterProperties = {
  status: 'all',
  search: '',
  dateFrom: undefined,
  dateTo: undefined
}

export default function ReconciliationView() {
  const [filters, setFilters] = useState<ReconciliationFilterProperties>(defaultFilters)

  // Fetch reconciliation data with filters
  const {
    data: reconciliationData = [],
    isLoading: isDataLoading,
    isFetching: isDataFetching,
    error: dataError,
    refetch: refetchData
  } = useQuery({
    queryKey: ['reconciliation', filters],
    queryFn: () => reconciliationService.getReconciliationData(filters),
    staleTime: 60_000
  })

  // Fetch stats data with filters
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['reconciliation-stats', filters],
    queryFn: () => reconciliationService.getReconciliationStats(filters),
    staleTime: 60_000
  })

  const handleFiltersChange = (newFilters: ReconciliationFilterProperties) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
  }

  const refreshAllData = () => {
    refetchData()
    refetchStats()
  }

  const error = dataError || statsError

  if (error)
    return <PageError errorMessage='Mutabakat verileri yüklenirken bir hata oluştu' onRefresh={refreshAllData} />

  return (
    <div className='flex flex-col gap-6 p-6 max-sm:p-0'>
      <ReconciliationHeader onRefresh={refreshAllData} isLoading={isDataFetching} />

      <ReconciliationFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <ReconciliationStats
        isLoading={isStatsLoading}
        stats={
          stats || {
            totalApproved: 0,
            totalPending: 0,
            totalFailed: 0,
            monthlyRevenue: 0,
            platformFees: 0,
            netRevenue: 0
          }
        }
      />

      <ReconciliationInfoAlert />

      {!error && <ReconciliationTable data={reconciliationData} isLoading={isDataLoading} />}
    </div>
  )
}
