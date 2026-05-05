'use client'

import type { PaginationOptions } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { supplyService } from '../service/supply.service'

export function useSupplyOrdersQuery() {
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 20 })

  const queryRes = useQuery({
    queryKey: ['supply-orders', pagination],
    queryFn: () => supplyService.listMyOrders({ pagination }),
    placeholderData: keepPreviousData
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
