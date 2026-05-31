'use client'

import { useQuery } from '@tanstack/react-query'
import { b2bCommerceService } from '../../service/b2b-commerce.service'

export function useB2BOrderDetailQuery(orderId?: string) {
  return useQuery({
    queryKey: ['b2b-order-detail', orderId],
    queryFn: () => b2bCommerceService.getOrderDetail(orderId!),
    enabled: Boolean(orderId)
  })
}

/** Havale bilgisi kullanıcıya göre tek kayıt; `orderId` path’i yok (GET /commerce/paymentInfo). */
export function useB2BPaymentInformationQuery(enabled = true) {
  return useQuery({
    queryKey: ['b2b-payment-information'],
    queryFn: () => b2bCommerceService.getPaymentInformation(),
    enabled,
    staleTime: 1000 * 60 * 60 * 3 // 3 saat
  })
}
