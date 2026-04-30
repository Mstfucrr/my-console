'use client'

import { useQuery } from '@tanstack/react-query'
import { supplyService } from '../service/supply.service'

export function useSupplyCategoriesQuery() {
  return useQuery({
    queryKey: ['supply-categories'],
    queryFn: () => supplyService.listCategories(),
    staleTime: 1000 * 60 * 60 * 2 // 2 saat
  })
}
