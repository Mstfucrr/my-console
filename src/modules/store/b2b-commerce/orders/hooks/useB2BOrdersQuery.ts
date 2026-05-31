'use client'

import type { PaginationOptions } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { b2bCommerceService } from '../../service/b2b-commerce.service'

export function useB2BOrdersQuery() {
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 20 })

  const queryRes = useQuery({
    queryKey: ['b2b-commerce', pagination],
    queryFn: () => b2bCommerceService.listOrders({ pagination }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60 * 3 // 3 saat
  })

  return {
    ...queryRes,
    data: queryRes.data?.data ?? [],
    total: queryRes.data?.total ?? 0,
    pagination,
    handlePageChange: (page: number) => setPagination(prev => ({ ...prev, page })),
    handlePageSizeChange: (limit: number) => setPagination({ page: 1, limit })
  }
}
