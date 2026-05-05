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

/** Havale bilgisi kullanıcıya göre tek kayıt; `orderId` path’i yok (GET /commerce/paymentInfo). */
export function useSupplyPaymentInformationQuery(enabled = true) {
  return useQuery({
    queryKey: ['supply-payment-information'],
    queryFn: () => supplyService.getPaymentInformation(),
    enabled,
    staleTime: 1000 * 60 * 60 * 3 // 3 saat
  })
}
