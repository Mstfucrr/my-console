'use client'

import { PaginationOptions } from '@/types'
import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query'
import type { ColumnSort } from '@tanstack/react-table'
import { useState } from 'react'

export type TenantListErrorConfig = {
  title: string
  description: string
  errorMessage: string
}

export function useTenantListQuery<TRecord, TFilters>(
  config: {
    queryKeyPrefix: string
    fetchFn: (
      filters: TFilters,
      pagination: PaginationOptions,
      sort: ColumnSort
    ) => Promise<{ data: TRecord[]; total: number }>
    defaultFilters: TFilters
    defaultSort: ColumnSort
  } & Omit<UseQueryOptions<{ data: TRecord[]; total: number }, Error, { data: TRecord[]; total: number }>, 'queryKey'>
) {
  const { queryKeyPrefix, fetchFn, defaultFilters, defaultSort, ...queryOptions } = config

  const [filters, setFilters] = useState<TFilters>(defaultFilters)
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 20 })
  const [sorting, setSorting] = useState<ColumnSort>(defaultSort)

  const handlePageSizeChange = (size: number) => {
    setPagination(prev => ({ ...prev, page: 1, limit: size }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const queryRes = useQuery({
    queryKey: [queryKeyPrefix, filters, pagination, sorting],
    queryFn: () => fetchFn(filters, pagination, sorting),
    placeholderData: keepPreviousData,
    ...queryOptions
  })

  const { data: pageData, ...queryMeta } = queryRes

  const handleFiltersChange = (newFilters: TFilters) => setFilters(newFilters)
  const handleRefresh = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    setFilters(defaultFilters)
    void queryRes.refetch()
  }
  const handleClearFilters = () => setFilters(defaultFilters)

  return {
    ...queryMeta,
    data: pageData?.data ?? [],
    total: pageData?.total ?? 0,
    filters,
    setFilters,
    handleFiltersChange,
    handleClearFilters,
    handleRefresh,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    sorting,
    setSorting
  }
}
