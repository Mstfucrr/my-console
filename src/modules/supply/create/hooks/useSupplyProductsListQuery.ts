'use client'

import type { PaginationOptions } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ColumnSort } from '@tanstack/react-table'
import { useState } from 'react'
import { supplyService } from '../service/supply.service'

export interface SupplyProductsFilters {
  search: string
  categoryId: string
  brandId: string
}

export const defaultSupplyProductsFilters: SupplyProductsFilters = {
  search: '',
  categoryId: 'all',
  brandId: 'all'
}

const defaultSupplyProductsSort: ColumnSort = {
  id: 'name',
  desc: false
}

export function useSupplyProductsListQuery() {
  const [filters, setFilters] = useState<SupplyProductsFilters>(defaultSupplyProductsFilters)
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 20 })
  const [sorting, setSorting] = useState<ColumnSort>(defaultSupplyProductsSort)

  const queryRes = useQuery({
    queryKey: ['supply-products', filters, pagination, sorting],
    queryFn: () =>
      supplyService.listProducts({
        search: filters.search,
        categoryId: filters.categoryId,
        brandId: filters.brandId,
        sortBy: sorting.id,
        sortDirection: sorting.desc ? 'desc' : 'asc',
        pagination
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60 * 2 // 2 saat
  })

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handlePageSizeChange = (limit: number) => {
    setPagination({ page: 1, limit })
  }

  const handleFiltersChange = (next: SupplyProductsFilters) => {
    setFilters(next)
    setPagination(prev => (prev.page === 1 ? prev : { ...prev, page: 1 }))
  }

  return {
    ...queryRes,
    data: queryRes.data?.data ?? [],
    total: queryRes.data?.total ?? 0,
    filters,
    sorting,
    setSorting,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange
  }
}
