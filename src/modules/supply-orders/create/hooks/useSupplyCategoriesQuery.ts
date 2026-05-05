'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { supplyService } from '../service/supply.service'

export function useSupplyCategoriesQuery(brandId?: string | string[]) {
  return useQuery({
    queryKey: ['supply-categories', brandId ?? 'all'],
    queryFn: () => supplyService.listCategories({ brandId }),
    staleTime: 1000 * 60 * 60 * 2, // 2 saat
    placeholderData: keepPreviousData
  })
}
