import { OrderStatusLabel } from '@/modules/types'

export function statusLabel(status: string) {
  return OrderStatusLabel[status as keyof typeof OrderStatusLabel] ?? status
}

export function statusColor(status: string) {
  const colorMap: Record<string, string> = {
    created: '#fb923c', // Beklemede - Orange
    shipped: '#f59e0b', // Yola Çıktı - Amber
    delivered: '#16a34a', // Teslim Edildi - Green
    cancelled: '#ef4444' // İptal Edildi - Red
  }
  return colorMap[status] ?? '#6b7280'
}
