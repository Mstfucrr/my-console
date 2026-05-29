/** Tek çalışma aralığı — form ve detay görünümü (FE kanonik modeli). */
export type StoreWorkingHourInterval = {
  start: string | null
  end: string | null
}

/** Haftanın bir günü — `intervals` kapalı günde tek boş aralık olabilir. */
export type StoreWorkingHoursDay = {
  day: string
  enabled: boolean
  intervals: StoreWorkingHourInterval[]
}

/** Sihirbaz / detay ekranında kullanılan haftalık çalışma saatleri (her zaman 7 gün). */
export type StoreWorkingHoursFe = StoreWorkingHoursDay[]
