'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, StoreIcon as Shop, XCircle } from 'lucide-react'

export function RestaurantFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: { search?: string; status?: 'active' | 'inactive' | undefined }
  onFiltersChange: (f: { search?: string; status?: 'active' | 'inactive' | undefined }) => void
  onClearFilters: () => void
}) {
  const hasActiveFilters = Boolean(filters.search || filters.status)

  return (
    <Card className='mb-4'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <div className='flex items-center gap-2'>
          <Shop className='text-amber-400' />
          <CardTitle className='text-base'>Restoran Filtreleme ve Arama</CardTitle>
        </div>
        {hasActiveFilters && (
          <Button size='xs' variant='outline' onClick={onClearFilters}>
            <XCircle className='mr-1 h-4 w-4' />
            Temizle
          </Button>
        )}
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          <div>
            <label className='text-muted-foreground mb-1 block text-xs'>Restoran Adı / Adres</label>
            <div className='relative'>
              <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2' />
              <Input
                className='pl-8'
                placeholder='Restoran ara...'
                value={filters.search ?? ''}
                onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className='text-muted-foreground mb-1 block text-xs'>Durum</label>
            <div className='flex flex-wrap items-center gap-2'>
              <Button
                size='xs'
                variant={filters.status === 'active' ? undefined : 'outline'}
                onClick={() =>
                  onFiltersChange({ ...filters, status: filters.status === 'active' ? undefined : 'active' })
                }
              >
                🟢 Aktif
              </Button>
              <Button
                size='xs'
                variant={filters.status === 'inactive' ? undefined : 'outline'}
                onClick={() =>
                  onFiltersChange({ ...filters, status: filters.status === 'inactive' ? undefined : 'inactive' })
                }
              >
                ⚪ Pasif
              </Button>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className='border-warning bg-warning/10 flex flex-wrap items-center gap-2 rounded-md border px-3 py-2'>
            <span className='text-muted-foreground text-xs'>Aktif filtreler:</span>
            {filters.status && (
              <Badge
                color={filters.status === 'active' ? 'success' : 'secondary'}
                variant='outline'
                className='text-xs'
              >
                {filters.status === 'active' ? 'Aktif Restoranlar' : 'Pasif Restoranlar'}
              </Badge>
            )}
            {filters.search && (
              <Badge color='info' variant='outline' className='text-xs'>
                Arama: &quot;{filters.search}&quot;
              </Badge>
            )}
          </div>
        )}

        <div className='border-success bg-success/10 rounded-md border px-3 py-2 text-xs text-green-700'>
          💡 İpucu: Restoran adı, adres veya telefon numarasına göre arama yapabilirsiniz.
        </div>
      </CardContent>
    </Card>
  )
}
