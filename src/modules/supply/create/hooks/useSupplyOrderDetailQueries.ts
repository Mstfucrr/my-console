'use client'

import { useQuery } from '@tanstack/react-query'
import { supplyService } from '../service/supply.service'

export function useSupplyOrderDetailQuery(orderId?: string) {
  return useQuery({
    queryKey: ['supply-my-order-detail', orderId],
    queryFn: () => supplyService.getMyOrderDetail(orderId!),
    enabled: Boolean(orderId)
  })
}

export function useSupplyOrderPaymentInformationQuery(orderId?: string) {
  return useQuery({
    queryKey: ['supply-payment-information', orderId],
    queryFn: () => supplyService.getOrderPaymentInformation(orderId!),
    enabled: Boolean(orderId),
    staleTime: 1000 * 60 * 60 * 3 // 3 saat
  })
}
