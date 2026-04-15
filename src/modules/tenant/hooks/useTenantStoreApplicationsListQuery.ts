'use client'

import type { ColumnSort } from '@tanstack/react-table'
import { useTenantListQuery } from '../shared/useTenantListQuery'
import { defaultStoreApplicationsFilters } from '../applications/components/applications-filters'
import { storeApplicationsService } from '../applications/service/applications.service'

const defaultSort: ColumnSort = { id: 'CreatedOn', desc: true }

/** Tenant başvuru listesi — `/applications` tablosu ile aynı yapılandırma. */
export function useTenantStoreApplicationsListQuery() {
  return useTenantListQuery({
    queryKeyPrefix: 'store-applications',
    fetchFn: (filters, pagination, sort) => storeApplicationsService.getStoreApplications(filters, pagination, sort),
    defaultFilters: defaultStoreApplicationsFilters,
    defaultSort
  })
}
