import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { FilterOptions, OrderStatus } from '@/modules/orders/types'
import { useMemo } from 'react'

const statuses: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Beklemede' },
  { value: 'preparing', label: 'Hazırlanıyor' },
  { value: 'ready', label: 'Hazır' },
  { value: 'picked_up', label: 'Kurye aldı' },
  { value: 'on_way', label: 'Yolda' },
  { value: 'delivered', label: 'Teslim edildi' },
  { value: 'cancelled', label: 'İptal edildi' }
]

export function OrderFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: FilterOptions
  onFiltersChange: (f: FilterOptions) => void
  onClearFilters: () => void
}) {
  const activeCount = useMemo(() => Object.values(filters).filter(Boolean).length, [filters])

  return (
    <div className='bg-card mb-4 flex flex-col gap-3 rounded-md border p-4'>
      <div className='flex flex-col items-start gap-3 sm:flex-row sm:items-center'>
        <Input
          placeholder='Ara: sipariş no, müşteri, adres...'
          value={filters.search ?? ''}
          onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
        />
        <div className='flex flex-wrap items-center gap-2'>
          {statuses.map(s => (
            <Badge
              key={s.value}
              variant={filters.status === s.value ? undefined : 'outline'}
              color={filters.status === s.value ? 'default' : 'secondary'}
              className='cursor-pointer'
              onClick={() => onFiltersChange({ ...filters, status: filters.status === s.value ? undefined : s.value })}
            >
              {s.label}
            </Badge>
          ))}
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='text-muted-foreground text-xs'>Aktif filtreler: {activeCount}</div>
        <div className='flex items-center gap-2'>
          <Input
            type='date'
            value={filters.dateFrom ?? ''}
            onChange={e => onFiltersChange({ ...filters, dateFrom: e.target.value })}
            className='w-40'
          />
          <Input
            type='date'
            value={filters.dateTo ?? ''}
            onChange={e => onFiltersChange({ ...filters, dateTo: e.target.value })}
            className='w-40'
          />
          <Button size='xs' variant='outline' color='secondary' onClick={onClearFilters}>
            Filtreleri Temizle
          </Button>
        </div>
      </div>
    </div>
  )
}
