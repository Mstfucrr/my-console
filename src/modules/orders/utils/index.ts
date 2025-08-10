function formatCurrencyTRY(amount: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
}

function formatDateTR(dateString: string) {
  return new Date(dateString).toLocaleString('tr-TR')
}

import type { OrderStatus } from '../../types'

const statusLabelMap: Record<OrderStatus, string> = {
  pending: 'Beklemede',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  picked_up: 'Kurye Aldı',
  on_way: 'Yolda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi'
}

export { formatCurrencyTRY, formatDateTR, statusLabelMap }
