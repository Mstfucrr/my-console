'use client'

import type { PaginationOptions } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ColumnSort } from '@tanstack/react-table'
import { useState } from 'react'
import { b2bCommerceService } from '../../../service/b2b-commerce.service'

export interface B2BProductsFilters {
  search: string
  categoryId: string
  brandId: string
}

export const defaultB2BProductsFilters: B2BProductsFilters = {
  search: '',
  categoryId: 'all',
  brandId: 'all'
}

const defaultB2BProductsSort: ColumnSort = {
  id: 'name',
  desc: false
}

export function useB2BProductsListQuery() {
  const [filters, setFilters] = useState<B2BProductsFilters>(defaultB2BProductsFilters)
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 20 })
  const [sorting, setSorting] = useState<ColumnSort>(defaultB2BProductsSort)

  const queryRes = useQuery({
    queryKey: ['b2b-products', filters, pagination, sorting],
    queryFn: () =>
      b2bCommerceService.listProducts({
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

  const handleFiltersChange = (next: B2BProductsFilters) => {
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
