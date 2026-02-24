'use client'

import PageError from '@/components/page-error'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ColumnSort } from '@tanstack/react-table'
import { useState } from 'react'
import ReconciliationTable from './components/reconciliation-table'
import { reconciliationService } from './service/reconciliation.service'

const defaultSort: ColumnSort = { id: 'period', desc: true }

export default function ReconciliationView() {
  const [sorting, setSorting] = useState<ColumnSort>(defaultSort)

  const {
    data: reconciliationData = [],
    isLoading: isDataLoading,
    isFetching: isDataFetching,
    error: error,
    refetch: refetchData
  } = useQuery({
    queryKey: ['reconciliation', sorting],
    queryFn: () => reconciliationService.getReconciliationData(sorting),
    placeholderData: keepPreviousData
  })

  if (error)
    return (
      <PageError
        errorMessage='Mutabakat verileri yüklenirken bir hata oluştu'
        onRefresh={refetchData}
        isLoading={isDataFetching}
        title='Mutabakat Verileri Yüklenemedi'
        description='Mutabakat verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  return (
    <div className='flex flex-col gap-4 pb-6 max-sm:p-0'>
      {!error && (
        <ReconciliationTable
          data={reconciliationData}
          isLoading={isDataLoading || isDataFetching}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      )}
    </div>
  )
}
