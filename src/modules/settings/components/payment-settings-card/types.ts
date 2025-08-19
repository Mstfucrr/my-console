import * as z from 'zod'

export type PaymentMethodType = 'cash' | 'card' | 'online'

export interface PaymentType {
  id: string
  name: string
  type: PaymentMethodType
  isActive: boolean
  terminalId?: string
  commissionRate?: number // %
}

export const PAYMENT_TYPE_OPTIONS = [
  { value: 'cash', label: 'Nakit' },
  { value: 'card', label: 'Kart' },
  { value: 'online', label: 'Online' }
] as const

export const paymentTypeSchema = z.object({
  name: z.string().min(1, 'Ödeme tipi adı gereklidir'),
  type: z.enum(['cash', 'card', 'online'], { required_error: 'Tip seçimi gereklidir' }),
  terminalId: z.string().optional(),
  commissionRate: z
    .union([z.string(), z.number()])
    .optional()
    .transform(val => {
      if (val === undefined || val === null || val === '') return undefined
      const n = typeof val === 'number' ? val : Number(val.toString().replace(',', '.'))
      return isNaN(n) ? undefined : n
    }),
  isActive: z.boolean().default(true)
})

export type PaymentTypeFormValues = z.infer<typeof paymentTypeSchema>
