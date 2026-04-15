import { DAY_LABELS_TR } from '../applications/create/constants'
import type { StoreWorkingHoursFe } from '../applications/types'

type TenantStoreWorkingHoursTableProps = {
  hours: StoreWorkingHoursFe
}

function formatHour(value: string | null | undefined): string {
  if (value == null || value === '') return '—'
  const digits = String(value).replace(/\D/g, '')
  if (digits.length === 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`
  return String(value)
}

export function TenantStoreWorkingHoursTable({ hours }: TenantStoreWorkingHoursTableProps) {
  return (
    <div className='border-border/60 overflow-x-auto rounded-lg border'>
      <table className='w-full min-w-[260px] text-sm'>
        <thead>
          <tr className='bg-muted/40 border-b text-left'>
            <th className='text-muted-foreground px-3 py-2 text-xs font-semibold uppercase'>Gün</th>
            <th className='text-muted-foreground px-3 py-2 text-xs font-semibold uppercase'>Durum</th>
            <th className='text-muted-foreground px-3 py-2 text-xs font-semibold uppercase'>Saat</th>
          </tr>
        </thead>
        <tbody>
          {hours.map(day => {
            const dayLabel = DAY_LABELS_TR[day.day] ?? day.day
            const status = day.enabled ? 'Açık' : 'Kapalı'
            const timesText = day.intervals.map(iv => `${formatHour(iv.start)} – ${formatHour(iv.end)}`).join(', ')
            return (
              <tr key={day.day} className='border-border/50 odd:bg-background/80 border-b last:border-0'>
                <td className='px-3 py-2.5 font-medium'>{dayLabel}</td>
                <td className='text-muted-foreground px-3 py-2.5'>
                  <span className='text-foreground'>{status}</span>
                </td>
                <td className='text-muted-foreground px-3 py-2.5'>{timesText}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
