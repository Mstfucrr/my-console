'use client'

import PageError from '@/components/page-error'
import { useTenantStoresListQuery } from '../hooks/useTenantStoresListQuery'
import { defaultStoresFilters } from './components/stores-filters'
import StoresTable from './components/stores-table'

export { defaultStoresFilters }

export function StoresView() {
  const state = useTenantStoresListQuery()

  if (state.error)
    return (
      <PageError
        errorMessage='Şube verileri yüklenirken bir hata oluştu'
        onRefresh={() => {
          state.handleClearFilters()
          state.refetch()
        }}
        isLoading={state.isFetching}
        title='Şube Verileri Yüklenemedi'
        description='Onaylı restoranlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  return (
    <div className='flex flex-col gap-4 pb-6 max-sm:p-0'>
      <StoresTable
        data={state.data}
        isLoading={state.isLoading || state.isFetching}
        filters={state.filters}
        onFiltersChange={state.handleFiltersChange}
        onClearFilters={state.handleClearFilters}
        onRefresh={state.refetch}
        sorting={state.sorting}
        onSortingChange={state.setSorting}
        onPageChange={state.handlePageChange}
        page={state.pagination.page}
        pageSize={state.pagination.limit}
        total={state.total}
        onPageSizeChange={state.handlePageSizeChange}
        enableMultiSort={false}
        manualSorting
      />
    </div>
  )
}
