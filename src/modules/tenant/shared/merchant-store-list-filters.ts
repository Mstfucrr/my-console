/**
 * Backend’in beklediği liste filtresi: `filter[0][column]=…&filter[0][value]=…`
 * (axios `params` nesnesine yazılır).
 */
export type MerchantStoreListFilterColumn = 'status' | 'restaurantName' | 'city'

export function appendMerchantStoreFilterParams(
  target: Record<string, string | number | string[] | undefined>,
  entries: Array<{ column: MerchantStoreListFilterColumn; value: string }>
): void {
  entries.forEach((e, i) => {
    target[`filter[${i}][column]`] = e.column
    target[`filter[${i}][value]`] = e.value
  })
}
