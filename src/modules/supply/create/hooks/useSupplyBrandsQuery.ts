'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { supplyService } from '../service/supply.service'

export function useSupplyBrandsQuery(categoryId?: string | string[]) {
  return useQuery({
    queryKey: ['supply-brands', categoryId ?? 'all'],
    queryFn: () => supplyService.listBrands({ categoryId }),
    staleTime: 1000 * 60 * 60 * 2, // 2 saat
    placeholderData: keepPreviousData
  })
}
