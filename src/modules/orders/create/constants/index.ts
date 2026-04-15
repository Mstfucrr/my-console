import { parseTRCurrencyToNumber } from '@/lib/formatCurrency'
import { PHONE_REGEX } from '@/lib/regex'
import { z } from 'zod'
import { CreateOrderFormData } from '../types'

export const createOrderSchema = z.object({
  // Müşteri Bilgileri
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır').max(50, 'Ad en fazla 50 karakter olabilir').default(''),
  lastName: z
    .string()
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(50, 'Soyad en fazla 50 karakter olabilir')
    .default(''),
  customerPhone: z
    .string()
    .default('')
    .refine(value => value.length === 10, { message: 'Telefon numarası 10 haneli olmalıdır' })
    .refine(value => PHONE_REGEX.test(value), { message: 'Telefon numarası 0 ile başlamamalıdır' }),
  extensionPhone: z.string().max(10, 'Dahili telefon numarası en fazla 10 haneli olabilir').optional(),

  totalAmount: z
    .string()
    .min(1, 'Toplam tutar zorunludur')
    .transform(parseTRCurrencyToNumber)
    .refine(v => Number.isFinite(v), { message: 'Toplam tutar geçersiz' })
    .refine(v => v > 0, { message: 'Toplam tutar sıfırdan büyük olmalıdır' })
    .refine(v => v < 100000, { message: "Toplam tutar 100.000 TL'den küçük olmalıdır" }),
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
  street: z.string().min(1, 'Sokak zorunludur').max(120, 'Sokak en fazla 120 karakter olabilir').default(''),
  buildingNumber: z
    .string()
    .min(1, 'Bina numarası zorunludur')
    .max(20, 'Bina numarası en fazla 20 karakter olabilir')
    .default(''),
  floor: z.string().max(3, 'Kat bilgisi en fazla 3 karakter olabilir').optional(),
  buildingName: z.string().max(100, 'Bina adı en fazla 100 karakter olabilir').optional(),
  doorNumber: z
    .string()
    .min(1, 'Kapı numarası zorunludur')
    .max(10, 'Kapı numarası en fazla 10 karakter olabilir')
    .default(''),
  fullAddress: z.string().max(300, 'Adres en fazla 300 karakter olabilir').default(''),
  addressDirection: z.string().max(300, 'Adres tarifi en fazla 300 karakter olabilir').optional(),

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
  totalAmount: '',
  city: { id: '', name: '' },
  county: { id: '', name: '' },
  district: { id: '', name: '' },
  street: '',
  buildingNumber: '',
  floor: '',
  buildingName: '',
  doorNumber: '',
  fullAddress: '',
  addressDirection: '',
  paymentTypeSId: '',
  contactlessDelivery: false,
  dontRingDoorBell: false
}
