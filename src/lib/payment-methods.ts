import { GroupedSelectOption, SelectOption } from '@/components/form/FormSelectField'
import { PAYMENT_METHOD_TYPE_LABELS, type PaymentMethod, type PaymentMethodType } from '@/types'

/**
 * Payment method'ları type'a göre gruplar ve SelectOption formatına çevirir
 * @param paymentMethods - Payment method listesi
 * @param useId - true ise `id`, false ise `key` kullanılır (varsayılan: false)
 * @returns Gruplu payment method seçenekleri
 */
export function groupPaymentMethods(
  paymentMethods: PaymentMethod[] | undefined,
  useId = false
): GroupedSelectOption[] | undefined {
  if (!paymentMethods || paymentMethods.length === 0) return undefined

  const sorted = [...paymentMethods].sort((a, b) => a.order - b.order)
  const grouped = sorted.reduce(
    (acc, pm) => {
      if (!acc[pm.type]) acc[pm.type] = []
      acc[pm.type].push({ value: useId ? pm.id : pm.key, label: pm.name })
      return acc
    },
    {} as Record<PaymentMethodType, SelectOption[]>
  )

  return Object.entries(grouped).map(([type, items]) => ({
    groupLabel: PAYMENT_METHOD_TYPE_LABELS[type as PaymentMethodType],
    items
  }))
}
