import type { CreateStoreApplicationPayload } from '../create/service/store-application.service.type'
import type { StoreWorkingHoursDay } from '../types/working-hours'

/** API ve POST gövdesindeki düz satır (gün başına birden fazla olabilir). */
export type StoreWorkingHourApiRow = CreateStoreApplicationPayload['workingHours'][number]

/**
 * Tablo / map fonksiyonlarında kullanılan sabit gün sırası (Pzt → Paz).
 * @example
 * WORKING_DAY_ORDER[0] // 'monday'
 */
export const WORKING_DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const CLOSED_INTERVAL: StoreWorkingHoursDay['intervals'] = [{ start: null, end: null }]

/**
 * FE modelini (gün + intervals[]) API’nin beklediği düz diziye çevirir.
 * @example
 * workingHoursFeToApi([{ day: 'monday', enabled: true, intervals: [{ start: '0900', end: '1200' }] }])
 * // [{ day: 'monday', enabled: true, start: '0900', end: '1200' }]
 */
export function workingHoursFeToApi(days: StoreWorkingHoursDay[]): StoreWorkingHourApiRow[] {
  return days.reduce<StoreWorkingHourApiRow[]>((acc, day) => {
    if (!day.enabled) {
      acc.push({ day: day.day, enabled: false, start: null, end: null })
      return acc
    }
    for (const interval of day.intervals) {
      acc.push({
        day: day.day,
        enabled: true,
        start: interval.start,
        end: interval.end
      })
    }
    return acc
  }, [])
}

/**
 * API’den gelen düz çalışma satırlarını FE modeline (gün başına intervals[]) dönüştürür.
 * @example
 * workingHoursApiToFe([
 *   { day: 'monday', enabled: true, start: '0900', end: '1200' },
 *   { day: 'monday', enabled: true, start: '1300', end: '2200' }
 * ])
 * // [{ day: 'monday', enabled: true, intervals: [{ start: '0900', end: '1200' }, ...] }, ...]
 */
/** Başvuru ve şube detay API’lerindeki düz çalışma satırları (aynı şekil). */
export type WorkingHourFlatRow = {
  day: string
  enabled: boolean
  start: string | null
  end: string | null
}

export function workingHoursApiToFe(flat: WorkingHourFlatRow[] | undefined): StoreWorkingHoursDay[] {
  return WORKING_DAY_ORDER.map(day => {
    const rows = (flat ?? []).filter(r => r.day === day)
    const openRows = rows.filter(r => r.enabled)
    if (openRows.length === 0) {
      return { day, enabled: false, intervals: [...CLOSED_INTERVAL] }
    }
    return {
      day,
      enabled: true,
      intervals: openRows.map(r => ({ start: r.start, end: r.end }))
    }
  })
}
