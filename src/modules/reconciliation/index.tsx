'use client'

import { useEffect, useState } from 'react'
import { ReconciliationFilters, type ReconciliationFilterProperties } from './components/reconciliation-filters'
import ReconciliationHeader from './components/reconciliation-header'
import ReconciliationInfoAlert from './components/reconciliation-info-alert'
import ReconciliationStats from './components/reconciliation-stats'
import ReconciliationTable from './components/reconciliation-table'
import { reconciliationService } from './service'
import type { ReconciliationRecord, ReconciliationStats as StatsType } from './types'

export default function ReconciliationView() {
  const [reconciliationData, setReconciliationData] = useState<ReconciliationRecord[]>([])
  const [stats, setStats] = useState<StatsType>({
    totalSettled: 0,
    totalPending: 0,
    totalFailed: 0,
    monthlyRevenue: 0,
    platformFees: 0,
    netRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ReconciliationFilterProperties>({
    status: 'all',
    search: '',
    dateFrom: undefined,
    dateTo: undefined
  })

  useEffect(() => {
    loadReconciliationData()
  }, [])

  const loadReconciliationData = async () => {
    setIsLoading(true)
    try {
      const [data, statsData] = await Promise.all([
        reconciliationService.getReconciliationData(),
        reconciliationService.getReconciliationStats()
      ])
      setReconciliationData(data)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load reconciliation data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: ReconciliationFilterProperties) => {
    setFilters(newFilters)
    // You can add debounced API call here if needed
  }

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      search: '',
      dateFrom: undefined,
      dateTo: undefined
    })
  }

  const filteredData = reconciliationData.filter(record => {
    // Status filter
    if (filters.status !== 'all' && record.status !== filters.status) {
      return false
    }

    // Search filter
    if (filters.search && !record.id.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    // Date filters
    if (filters.dateFrom && new Date(record.date) < new Date(filters.dateFrom)) {
      return false
    }
    if (filters.dateTo && new Date(record.date) > new Date(filters.dateTo)) {
      return false
    }

    return true
  })

  return (
    <div className='space-y-6 p-6'>
      <ReconciliationHeader onRefresh={loadReconciliationData} isLoading={isLoading} />

      <ReconciliationStats stats={stats} />

      <ReconciliationFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <ReconciliationInfoAlert />

      <ReconciliationTable data={filteredData} isLoading={isLoading} />
    </div>
  )
}
