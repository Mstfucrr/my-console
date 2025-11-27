import { FilterOption } from '@/components/ui/filter-card'
import { z } from 'zod'

const transformPriceToNumber = (price: string) => {
  return Number(price)
}

export const createOrderSchema = z.object({
  // Müşteri Bilgileri
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır').default(''),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır').default(''),
  customerPhone: z.string().min(10, 'Telefon numarası en az 10 karakter olmalıdır').default(''),
  extensionPhone: z.string().optional(),

  // Sipariş Bilgileri
  preparationTime: z
    .string()
    .min(1, 'Hazırlık süresi zorunludur')
    .default('')
    .transform(transformPriceToNumber)
    .refine(value => value >= 1, { message: 'Hazırlık süresi en az 1 dakika olmalıdır' })
    .refine(value => value <= 120, { message: 'Hazırlık süresi en fazla 120 dakika olabilir' }),
  totalAmount: z
    .string()
    .min(1, 'Toplam tutar zorunludur')
    .default('')
    .transform(transformPriceToNumber)
    .refine(value => value > 0, { message: 'Toplam tutar sıfırdan büyük olmalıdır' }),

  // Adres Bilgileri
  city: z.string().min(1, 'Şehir zorunludur').default(''),
  county: z.string().min(1, 'İlçe zorunludur').default(''),
  neighborhood: z.string().min(1, 'Mahalle zorunludur').default(''),
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
  ringDoorBell: z.boolean().default(true)
})

export const paymentMethods: FilterOption[] = [
  { value: 'cash', label: 'Nakit' },
  { value: 'offline-credit-card', label: 'Kapıda Ödeme (Kredi/Banka Kartı)' },
  { value: 'offline-sodexo', label: 'Sodexo' },
  { value: 'offline-ticket', label: 'Ticket' },
  { value: 'offline-setcard', label: 'Setcard' },
  { value: 'offline-metropol-card', label: 'Metropol Card' },
  { value: 'offline-paye-card', label: 'Paye Card' },
  { value: 'offline-multinet', label: 'Multinet Mobil' },
  {
    value: 'online-credit-card',
    label: 'Online Ödeme (Kredi/Banka Kartı)'
  },
  { value: 'online-setcard', label: 'Setcard Online' },
  { value: 'online-sodexo', label: 'Sodexo Online' },
  { value: 'online-ticket', label: 'Ticket Online' },
  { value: 'online-metropol', label: 'Metropol Online' },
  { value: 'online-multinet', label: 'Multinet Online' },
  { value: 'online-pluxee', label: 'Pluxee Online' }
]
