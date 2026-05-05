export const B2B_FILTER_ALL = 'all'

export type B2BFilterSelectionValue = string | string[] | undefined

export function parseB2BFilterSelection(value: B2BFilterSelectionValue): string[] {
  if (!value) return []

  const rawValues = Array.isArray(value) ? value : value.split(',')

  return rawValues.map(item => item.trim()).filter(item => item && item !== B2B_FILTER_ALL)
}

export function serializeB2BFilterSelection(ids: string[]): string {
  return ids.length > 0 ? ids.join(',') : B2B_FILTER_ALL
}
