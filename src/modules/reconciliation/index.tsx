'use client'

import PageError from '@/components/page-error'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ReconciliationInfoAlert from './components/reconciliation-info-alert'
import ReconciliationStats from './components/reconciliation-stats'
import ReconciliationTable from './components/reconciliation-table'
import { reconciliationService } from './service'
import type { ReconciliationFilterProperties } from './types'

export const defaultReconciliationFilters: ReconciliationFilterProperties = {
  status: 'all'
}

export default function ReconciliationView() {
  const [filters, setFilters] = useState<ReconciliationFilterProperties>(defaultReconciliationFilters)

  // Fetch reconciliation data with filters
  const {
    data: reconciliationData = [],
    isLoading: isDataLoading,
    isFetching: isDataFetching,
    error: dataError,
    refetch: refetchData
  } = useQuery({
    queryKey: ['reconciliation', filters],
    queryFn: () => reconciliationService.getReconciliationData(filters)
  })

  // Fetch stats data with filters
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
    isFetching: isStatsFetching
  } = useQuery({
    queryKey: ['reconciliation-stats'],
    queryFn: () => reconciliationService.getReconciliationStats(),
    staleTime: 60_000
  })

  const handleFiltersChange = (newFilters: ReconciliationFilterProperties) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultReconciliationFilters)
  }

  const refreshAllData = () => {
    refetchData()
    refetchStats()
  }

  const error = dataError || statsError

  if (error)
    return (
      <PageError
        errorMessage='Mutabakat verileri yüklenirken bir hata oluştu'
        onRefresh={refreshAllData}
        isLoading={isDataFetching || isStatsLoading}
        title='Mutabakat Verileri Yüklenemedi'
        description='Mutabakat verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  return (
    <div className='flex flex-col gap-6 py-6 max-sm:p-0'>
      {/* <ReconciliationHeader  /> */}

      <ReconciliationStats isLoading={isStatsLoading || isStatsFetching} stats={stats} />

      <ReconciliationInfoAlert />

      {!error && (
        <ReconciliationTable
          data={reconciliationData}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          isLoading={isDataLoading || isDataFetching}
          onRefresh={refreshAllData}
        />
      )}
    </div>
  )
}
