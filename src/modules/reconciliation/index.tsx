'use client'

import PageError from '@/components/page-error'
import { getOperationDateRange } from '@/constants'
import { PaginationOptions } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ColumnSort } from '@tanstack/react-table'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import ReconciliationTable from './components/reconciliation-table'
import { reconciliationService } from './service/reconciliation.service'

const defaultSort: ColumnSort = { id: 'period', desc: true }

export const defaultReconciliationDateRange: DateRange = {
  from: new Date(
    new Date(getOperationDateRange().endDate).setDate(new Date(getOperationDateRange().endDate).getDate() - 60)
  ),
  to: new Date(getOperationDateRange().endDate)
}

export default function ReconciliationView() {
  const [sorting, setSorting] = useState<ColumnSort>(defaultSort)
  const [dateRange, setDateRange] = useState<DateRange>(defaultReconciliationDateRange)
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 20
  })

  const {
    data: reconciliationData,
    isLoading: isDataLoading,
    isFetching: isDataFetching,
    error: error,
    refetch: refetchData
  } = useQuery({
    queryKey: ['reconciliation', sorting, pagination, dateRange],
    queryFn: () => reconciliationService.getReconciliationData(dateRange, pagination, sorting),
    placeholderData: keepPreviousData
  })

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return
    setPagination(prev => ({ ...prev, page: 1 }))
    setDateRange(range)
  }

  const handleRefresh = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    setDateRange(defaultReconciliationDateRange)
    void refetchData()
  }

  if (error)
    return (
      <PageError
        errorMessage='Mutabakat verileri yüklenirken bir hata oluştu'
        onRefresh={handleRefresh}
        isLoading={isDataFetching}
        title='Mutabakat Verileri Yüklenemedi'
        description='Mutabakat verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  return (
    <div className='flex flex-col gap-4 pb-6 max-sm:p-0'>
      <ReconciliationTable
        data={reconciliationData?.data || []}
        isLoading={isDataLoading || isDataFetching}
        sorting={sorting}
        onSortingChange={setSorting}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        page={pagination.page}
        pageSize={pagination.limit}
        total={reconciliationData?.total || 0}
        onPageChange={page => setPagination(prev => ({ ...prev, page }))}
        onPageSizeChange={limit => setPagination({ page: 1, limit })}
      />
    </div>
  )
}
