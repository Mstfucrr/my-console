import { privateAxiosInstance } from '@/lib/axios'
import { PaymentMethod } from '@/types'
import { useQuery } from '@tanstack/react-query'

class PaymentMethodsService {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data } = await privateAxiosInstance.get<PaymentMethod[]>('/orders/payment-methods')
    return data || []
  }
}

const paymentMethodsService = new PaymentMethodsService()

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => paymentMethodsService.getPaymentMethods()
  })
}
