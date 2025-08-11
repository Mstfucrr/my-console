import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FilterOptions, OrderStatus } from '@/modules/types'
import { Search, ShoppingBag, XCircle } from 'lucide-react'
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
  const hasActiveFilters = useMemo(
    () => Boolean(filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo),
    [filters]
  )

  const activeCount = useMemo(
    () => (hasActiveFilters ? Object.values(filters).filter(Boolean).length : 0),
    [filters, hasActiveFilters]
  )

  return (
    <Card className='mb-4'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <div className='flex items-center gap-2'>
          <ShoppingBag className='text-amber-400' />
          <CardTitle className='text-base'>Sipariş Filtreleme ve Arama</CardTitle>
        </div>
        {hasActiveFilters && (
          <Button size='xs' variant='outline' onClick={onClearFilters}>
            <XCircle className='mr-1 h-4 w-4' />
            Temizle
          </Button>
        )}
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex w-full gap-3'>
          <div className='flex flex-auto flex-col items-start gap-3 sm:flex-row sm:items-center'>
            <div className='flex-1'>
              <label className='text-muted-foreground mb-1 block text-xs'>Sipariş No / Müşteri / Adres</label>
              <Input
                Icon={Search}
                placeholder='Sipariş No / Müşteri / Adres...'
                value={filters.search ?? ''}
                onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
                size='sm'
              />
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <div>
                <label className='text-muted-foreground mb-1 block text-xs'>Durum</label>
                <Select
                  value={filters.status}
                  onValueChange={value => onFiltersChange({ ...filters, status: value as OrderStatus | undefined })}
                >
                  <SelectTrigger className='w-[180px]' size='sm'>
                    <SelectValue placeholder='Durum seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Tümü</SelectItem>
                    {statuses.map(s => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <div>
                <label className='text-muted-foreground mb-1 block text-xs'>Başlangıç Tarihi</label>
                <Input
                  type='date'
                  value={filters.dateFrom ?? ''}
                  onChange={e => onFiltersChange({ ...filters, dateFrom: e.target.value })}
                  className='w-40'
                  size='sm'
                />
              </div>
              <div>
                <label className='text-muted-foreground mb-1 block text-xs'>Bitiş Tarihi</label>
                <Input
                  type='date'
                  value={filters.dateTo ?? ''}
                  onChange={e => onFiltersChange({ ...filters, dateTo: e.target.value })}
                  className='w-40'
                  size='sm'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='text-muted-foreground text-xs'>Aktif filtreler: {activeCount}</div>

        {hasActiveFilters && (
          <div className='border-warning bg-warning/10 mt-2 flex flex-wrap items-center gap-2 rounded-md border px-3 py-2'>
            <span className='text-muted-foreground text-xs'>Aktif filtreler:</span>
            {filters.status && (
              <Badge color='info' variant='outline' className='text-xs'>
                {statuses.find(s => s.value === filters.status)?.label ?? filters.status}
              </Badge>
            )}
            {filters.search && (
              <Badge color='info' variant='outline' className='text-xs'>
                Arama: &quot;{filters.search}&quot;
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
