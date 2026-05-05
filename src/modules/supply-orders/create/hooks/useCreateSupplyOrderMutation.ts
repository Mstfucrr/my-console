'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supplyService } from '../service/supply.service'

export function useCreateSupplyOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: supplyService.createOrder.bind(supplyService),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['supply-orders'] })
    }
  })
}
