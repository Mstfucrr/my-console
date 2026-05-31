'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { b2bCommerceService } from '../../../service/b2b-commerce.service'

export function useCreateB2BOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: b2bCommerceService.createOrder.bind(b2bCommerceService),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['b2b-commerce'] })
    }
  })
}
