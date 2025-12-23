import { z } from 'zod'
import { CreateOrderFormData } from '../types'

const transformPriceToNumber = (price: string) => {
  return Number(price)
}

const PHONE_REGEX = /^[1-9][0-9]{9}$/

export const createOrderSchema = z.object({
  // Müşteri Bilgileri
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır').default(''),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır').default(''),
  customerPhone: z
    .string()
    .default('')
    .refine(value => value.length === 10, { message: 'Telefon numarası 10 haneli olmalıdır' })
    .refine(value => PHONE_REGEX.test(value), { message: 'Telefon numarası 0 ile başlamamalıdır' }),
  extensionPhone: z.string().max(10, 'Dahili telefon numarası en fazla 10 haneli olabilir').optional(),

  // Sipariş Bilgileri
  preparationTime: z
    .string()
    .transform(transformPriceToNumber)
    .default('7')
    .refine(value => value >= 1, { message: 'Hazırlık süresi en az 1 dakika olmalıdır' })
    .refine(value => value <= 120, { message: 'Hazırlık süresi en fazla 120 dakika olabilir' }),
  totalAmount: z
    .string()
    .min(1, 'Toplam tutar zorunludur')
    .transform(transformPriceToNumber)
    .default('')
    .refine(value => value > 0, { message: 'Toplam tutar sıfırdan büyük olmalıdır' }),

  // Adres Bilgileri
  city: z.object({
    id: z.string().min(1, 'Şehir zorunludur').default(''),
    name: z.string()
  }),
  county: z.object({
    id: z.string().min(1, 'İlçe zorunludur').default(''),
    name: z.string()
  }),
  district: z.object({
    id: z.string().min(1, 'Mahalle zorunludur').default(''),
    name: z.string()
  }),
  street: z.string().min(1, 'Sokak zorunludur').default(''),
  buildingNumber: z.string().min(1, 'Bina numarası zorunludur').default(''),
  floor: z.string().optional(),
  buildingName: z.string().optional(),
  doorNumber: z.string().min(1, 'Kapı numarası zorunludur').default(''),
  postalCode: z.string().optional(),
  fullAddress: z.string().min(10, 'Tam adres en az 10 karakter olmalıdır').default(''),
  addressDirection: z.string().optional(),

  // Ödeme ve Teslimat
  paymentTypeSId: z.string().min(1, 'Ödeme tipi seçimi zorunludur').default(''),
  contactlessDelivery: z.boolean().default(false),
  dontRingDoorBell: z.boolean().default(false)
})

export const defaultCreateOrderValues: CreateOrderFormData = {
  firstName: '',
  lastName: '',
  customerPhone: '',
  extensionPhone: '',
  // @ts-expect-error - zod defaultValues için
  preparationTime: '7',
  // @ts-expect-error - zod defaultValues için
  totalAmount: '',
  city: { id: '', name: '' },
  county: { id: '', name: '' },
  district: { id: '', name: '' },
  street: '',
  buildingNumber: '',
  floor: '',
  buildingName: '',
  doorNumber: '',
  postalCode: '',
  fullAddress: '',
  addressDirection: '',
  paymentTypeSId: '',
  contactlessDelivery: false,
  dontRingDoorBell: false
}
