import { FilterOption } from '@/components/ui/filter-card'

export const PAYMENT_METHODS: FilterOption[] = [
  { value: 'all', label: 'Ödeme yöntemleri' },
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
