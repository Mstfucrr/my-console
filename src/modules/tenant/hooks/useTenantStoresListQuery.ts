'use client'

import { useQuery } from '@tanstack/react-query'
import type { ColumnSort } from '@tanstack/react-table'
import { useTenantListQuery } from '../shared/useTenantListQuery'
import { defaultStoresFilters } from '../stores/components/stores-filters'
import { storesService } from '../stores/service/stores.service'

const defaultSort: ColumnSort = { id: 'CreatedOn', desc: true }

const STORES_WHEN_NO_APPLICATIONS_QUERY_KEY = ['my-stores', 'when-no-applications'] as const

/** Tenant onaylı şube listesi — `/stores` tablosu ile aynı yapılandırma. */
export function useTenantStoresListQuery() {
  return useTenantListQuery({
    queryKeyPrefix: 'my-stores',
    fetchFn: (filters, pagination, sort) => storesService.getStores(filters, pagination, sort),
    defaultFilters: defaultStoresFilters,
    defaultSort
  })
}

/**
 * Başvuru yokken şube var mı diye hafif sorgu (`/applications` boş durum kartları).
 * `enabled` genelde `listState.isSuccess && listState.total === 0` olmalı.
 */
export function useStoresWhenNoApplicationsQuery(enabled: boolean) {
  return useQuery({
    queryKey: [...STORES_WHEN_NO_APPLICATIONS_QUERY_KEY, defaultStoresFilters, defaultSort],
    queryFn: () => storesService.getStores(defaultStoresFilters, { page: 1, limit: 1 }, defaultSort),
    enabled,
    staleTime: 3 * 60 * 1000
  })
}
