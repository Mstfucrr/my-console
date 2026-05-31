'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { b2bCommerceService } from '../../../service/b2b-commerce.service'

export function useB2BCategoriesQuery(brandId?: string | string[]) {
  return useQuery({
    queryKey: ['b2b-categories', brandId ?? 'all'],
    queryFn: () => b2bCommerceService.listCategories({ brandId }),
    staleTime: 1000 * 60 * 60 * 2, // 2 saat
    placeholderData: keepPreviousData
  })
}
