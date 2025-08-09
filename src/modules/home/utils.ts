export function statusLabel(status: string) {
  const map: Record<string, string> = {
    delivered: 'Teslim Edildi',
    on_way: 'Yolda',
    cancelled: 'İptal Edildi',
    preparing: 'Hazırlanıyor',
    ready: 'Hazır',
    pending: 'Beklemede'
  }
  return map[status] ?? status
}

export function statusColor(status: string) {
  const colorMap: Record<string, string> = {
    delivered: '#16a34a',
    on_way: '#f59e0b',
    cancelled: '#ef4444',
    preparing: '#3b82f6',
    ready: '#22c55e',
    pending: '#fb923c'
  }
  return colorMap[status] ?? '#6b7280'
}
