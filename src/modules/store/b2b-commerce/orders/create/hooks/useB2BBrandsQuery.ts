'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { b2bCommerceService } from '../../../service/b2b-commerce.service'

export function useB2BBrandsQuery(categoryId?: string | string[]) {
  return useQuery({
    queryKey: ['b2b-brands', categoryId ?? 'all'],
    queryFn: () => b2bCommerceService.listBrands({ categoryId }),
    staleTime: 1000 * 60 * 60 * 2, // 2 saat
    placeholderData: keepPreviousData
  })
}
