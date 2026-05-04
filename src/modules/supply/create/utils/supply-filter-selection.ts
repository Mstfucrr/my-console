export const SUPPLY_FILTER_ALL = 'all'

export type SupplyFilterSelectionValue = string | string[] | undefined

export function parseSupplyFilterSelection(value: SupplyFilterSelectionValue): string[] {
  if (!value) return []

  const rawValues = Array.isArray(value) ? value : value.split(',')

  return rawValues
    .map(item => item.trim())
    .filter(item => item && item !== SUPPLY_FILTER_ALL)
}

export function serializeSupplyFilterSelection(ids: string[]): string {
  return ids.length > 0 ? ids.join(',') : SUPPLY_FILTER_ALL
}
