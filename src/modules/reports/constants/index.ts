import { FilterOption } from '@/components/ui/filter-card'
import { OrderStatusGroup } from '@/constants/orders'
import { OrderStatusesGroups } from '@/types'

export const STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Durumlar' },
  { value: OrderStatusesGroups.DELIVERED, label: OrderStatusGroup[OrderStatusesGroups.DELIVERED].label },
  { value: OrderStatusesGroups.CANCELLED, label: OrderStatusGroup[OrderStatusesGroups.CANCELLED].label }
]

export const PAYMENT_METHOD_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Ödeme Yöntemleri' },
  { value: 'Nakit', label: 'Nakit' },
  { value: 'Kapıda Ödeme (Kredi/Banka Kartı)', label: 'Kapıda Ödeme (Kredi/Banka Kartı)' },
  { value: 'offline-sodexo', label: 'Sodexo' },
  { value: 'Ticket', label: 'Ticket' },
  { value: 'Setcard', label: 'Setcard' },
  { value: 'Metropol Card', label: 'Metropol Card' },
  { value: 'Paye Card', label: 'Paye Card' },
  { value: 'Multinet Mobil', label: 'Multinet Mobil' },
  { value: 'Online Ödeme (Kredi/Banka Kartı)', label: 'Online Ödeme (Kredi/Banka Kartı)' },
  { value: 'Setcard Online', label: 'Setcard Online' },
  { value: 'Sodexo Online', label: 'Sodexo Online' },
  { value: 'Ticket Online', label: 'Ticket Online' },
  { value: 'Metropol Online', label: 'Metropol Online' },
  { value: 'Multinet Online', label: 'Multinet Online' },
  { value: 'Pluxee Online', label: 'Pluxee Online' }
]
