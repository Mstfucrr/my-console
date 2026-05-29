export type StatusBadgeColor = 'secondary' | 'success' | 'info' | 'destructive'

/** Onaylı restoran (şube) durumları — tek kaynak: tablo badge (+ ileride filtre) */
export const STORE_STATUS_COLORS: Record<number, StatusBadgeColor> = {
  1: 'success'
}

export const STORE_STATUS_OPTIONS: readonly { code: number; value: string }[] = [
  { code: 1, value: 'Sözleşmeli müşteri' }
]

/** Onaylı restoranlar listesi — filtre dokümanda yok; gerekirse sonra eklenir */
export const STORES_LIST_PAGE_SIZE = 20
