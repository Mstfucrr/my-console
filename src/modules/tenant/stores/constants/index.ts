export type StatusBadgeColor = 'secondary' | 'success' | 'info' | 'destructive'

/** Onaylı restoran (şube) durumları — tek kaynak: tablo badge (+ ileride filtre) */
export const STORE_STATUS_CONFIG: Record<number, { label: string; color: StatusBadgeColor }> = {
  1: { label: 'Aktif', color: 'success' }
}

export function getStoreStatusLabel(status: number): string {
  return STORE_STATUS_CONFIG[status]?.label ?? String(status)
}

export function getStoreStatusColor(status: number): StatusBadgeColor {
  return STORE_STATUS_CONFIG[status]?.color ?? 'secondary'
}

/** Onaylı restoranlar listesi — filtre dokümanda yok; gerekirse sonra eklenir */
export const STORES_LIST_PAGE_SIZE = 20
