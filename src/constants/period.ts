const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık'
]

// Mutabakat Dönemi Yıl
const YEARS = [2023, 2024, 2025]

// Eğer saat 05:00 geçtiyse bugünün 05:00 ile yarının 05:00, yoksa dünün 05:00 ile bugünün 05:00 arasını al
export function getOperationDateRange(): { startDate: string; endDate: string } {
  const now = new Date()
  const baseDate = new Date(now)

  // 05:00'dan önceyse operasyon günü bir önceki gün
  if (now.getHours() < 5) {
    baseDate.setDate(baseDate.getDate() - 1)
  }

  // Start: baseDate 05:00
  const start = new Date(baseDate)
  start.setHours(5, 0, 0, 0)

  // End: start + 1 gün (Date kendi ay/yıl geçişini halleder)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  const pad = (n: number) => String(n).padStart(2, '0')
  const format = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

  return {
    startDate: format(start),
    endDate: format(end)
  }
}

export { MONTHS, YEARS }
