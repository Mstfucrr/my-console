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
  const currentHour = now.getHours()
  const baseDate = new Date(now)

  if (currentHour < 5) {
    baseDate.setDate(now.getDate() - 1)
  }

  const year = baseDate.getFullYear()
  const month = String(baseDate.getMonth() + 1).padStart(2, '0')
  const day = String(baseDate.getDate()).padStart(2, '0')
  const nextDay = String(baseDate.getDate() + 1).padStart(2, '0')
  const startDate = `${year}-${month}-${day}T05:00`
  const endDate = `${year}-${month}-${nextDay}T05:00`

  return { startDate, endDate }
}

export { MONTHS, YEARS }
