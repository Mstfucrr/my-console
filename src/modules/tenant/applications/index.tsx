'use client'

import PageError from '@/components/page-error'
import { useTenantStoreApplicationsListQuery } from '../hooks/useTenantStoreApplicationsListQuery'
import { useStoresWhenNoApplicationsQuery } from '../hooks/useTenantStoresListQuery'
import { ApplicationsEmptyGuidanceCard } from './components/applications-empty-guidance-card'
import { defaultStoreApplicationsFilters } from './components/applications-filters'
import { ApplicationsPageLoadingCard } from './components/applications-page-loading-card'
import { ApplicationsTable } from './components/applications-table'

export function ApplicationsView() {
  const listState = useTenantStoreApplicationsListQuery()

  const hasAnyApplication =
    listState.total > 0 || JSON.stringify(listState.filters) !== JSON.stringify(defaultStoreApplicationsFilters)

  const storesWhenEmptyApplications = useStoresWhenNoApplicationsQuery(listState.isSuccess && !hasAnyApplication)

  if (listState.error)
    return (
      <PageError
        errorMessage='Başvuru verileri yüklenirken bir hata oluştu'
        onRefresh={() => {
          listState.handleClearFilters()
          listState.refetch()
        }}
        isLoading={listState.isFetching}
        title='Başvuru Verileri Yüklenemedi'
        description='Başvuru verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  if (listState.isLoading) {
    return <ApplicationsPageLoadingCard label='Başvurular yükleniyor...' />
  }

  if (hasAnyApplication) {
    return (
      <div className='flex flex-col gap-4 pb-6 max-sm:p-0'>
        <ApplicationsTable
          data={listState.data}
          filters={listState.filters}
          onFiltersChange={listState.handleFiltersChange}
          onClearFilters={listState.handleClearFilters}
          onRefresh={listState.refetch}
          total={listState.total}
          isLoading={listState.isLoading || listState.isFetching}
          page={listState.pagination.page}
          pageSize={listState.pagination.limit}
          onPageChange={listState.handlePageChange}
          onPageSizeChange={listState.handlePageSizeChange}
          sorting={listState.sorting}
          onSortingChange={listState.setSorting}
          enableMultiSort={false}
          manualSorting
        />
      </div>
    )
  }

  if (storesWhenEmptyApplications.error) return <ApplicationsEmptyGuidanceCard variant='new-store-branch' />

  if (storesWhenEmptyApplications.isLoading) {
    return <ApplicationsPageLoadingCard label='Başvurular yükleniyor...' />
  }

  const hasAnyStore = (storesWhenEmptyApplications.data?.total ?? 0) > 0

  if (!hasAnyStore) return <ApplicationsEmptyGuidanceCard variant='resume-application' />

  return <ApplicationsEmptyGuidanceCard variant='new-store-branch' />
}
