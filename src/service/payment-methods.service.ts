import { privateAxiosInstance } from '@/lib/axios'
import { PaymentMethod } from '@/types'
import { useQuery } from '@tanstack/react-query'

interface PaymentMethodsResponse {
  paymentMethods: PaymentMethod[]
}

class PaymentMethodsService {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data } = await privateAxiosInstance.get<PaymentMethodsResponse>('/orders/payment-methods')
    return data?.paymentMethods.filter(paymentMethod => paymentMethod.id !== '') || []
  }
}

const paymentMethodsService = new PaymentMethodsService()

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => paymentMethodsService.getPaymentMethods()
  })
}
