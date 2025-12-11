'use client'

import PageError from '@/components/page-error'
import { useQuery } from '@tanstack/react-query'
import ReconciliationTable from './components/reconciliation-table'
import { reconciliationService } from './service/reconciliation.service'

export default function ReconciliationView() {
  const {
    data: reconciliationData = [],
    isLoading: isDataLoading,
    isFetching: isDataFetching,
    error: error,
    refetch: refetchData
  } = useQuery({
    queryKey: ['reconciliation'],
    queryFn: () => reconciliationService.getReconciliationData()
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
    <div className='flex flex-col gap-4 py-6 max-sm:p-0'>
      {!error && <ReconciliationTable data={reconciliationData} isLoading={isDataLoading || isDataFetching} />}
    </div>
  )
}
