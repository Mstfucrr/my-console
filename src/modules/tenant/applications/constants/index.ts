export type StatusBadgeColor = 'secondary' | 'success' | 'info' | 'destructive'

/**
 * Rozet rengi — API `key` ile eşleşir; etiket metni `application-statuses` cevabındaki `value` ile gösterilir.
 * Haritada olmayan key'ler için `secondary` kullanılır.
 */
export const STORE_APPLICATION_STATUS_COLORS: Partial<Record<number, StatusBadgeColor>> = {
  1: 'info',
  2: 'success'
}
