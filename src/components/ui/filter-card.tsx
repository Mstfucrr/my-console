'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LucideIcon, XCircle } from 'lucide-react'
import { ReactNode } from 'react'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  title: string
  icon: LucideIcon
  searchPlaceholder?: string
  statusOptions?: FilterOption[]
  showDateFilters?: boolean
  tipText?: string
}

export interface FilterCardProps<T> {
  config: FilterConfig
  filters: T
  onFiltersChange: (filters: T) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  children?: ReactNode
}

export function FilterCard<T>({ config, onClearFilters, hasActiveFilters, children }: FilterCardProps<T>) {
  const { title, icon: Icon, tipText } = config

  return (
    <Card className='mb-4'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <div className='flex items-center gap-2'>
          <Icon className='text-amber-400' />
          <CardTitle className='text-base'>{title}</CardTitle>
        </div>
        {hasActiveFilters && (
          <Button size='xs' variant='outline' onClick={onClearFilters}>
            <XCircle className='mr-1 h-4 w-4' />
            Temizle
          </Button>
        )}
      </CardHeader>
      <CardContent className='space-y-3'>
        {children}

        {tipText && (
          <div className='border-success bg-success/10 rounded-md border px-3 py-2 text-xs text-green-700'>
            💡 İpucu: {tipText}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function SearchInput({
  placeholder,
  value,
  onChange,
  Icon
}: {
  placeholder: string
  value: string
  onChange: (value: string) => void
  Icon: LucideIcon
}) {
  return (
    <div>
      <label className='text-muted-foreground mb-1 block text-xs'>Arama</label>
      <Input Icon={Icon} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} size='sm' />
    </div>
  )
}

export function StatusSelect({
  options,
  value,
  onChange,
  placeholder = 'Durum'
}: {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className='text-muted-foreground mb-1 block text-xs'>Durum</label>
      <div className='flex flex-wrap items-center gap-2'>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className='w-[180px]' size='sm'>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function DateFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange
}: {
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
}) {
  return (
    <div className='flex items-center gap-2'>
      <div>
        <label className='text-muted-foreground mb-1 block text-xs'>Başlangıç Tarihi</label>
        <Input
          type='date'
          value={dateFrom}
          onChange={e => onDateFromChange(e.target.value)}
          className='w-40'
          size='sm'
        />
      </div>
      <div>
        <label className='text-muted-foreground mb-1 block text-xs'>Bitiş Tarihi</label>
        <Input type='date' value={dateTo} onChange={e => onDateToChange(e.target.value)} className='w-40' size='sm' />
      </div>
    </div>
  )
}

export function ActiveFiltersDisplay({
  filters,
  statusOptions
}: {
  filters: Record<string, any>
  statusOptions?: FilterOption[]
}) {
  return (
    <div className='border-warning bg-warning/10 flex flex-wrap items-center gap-2 rounded-md border px-3 py-2'>
      <span className='text-muted-foreground text-xs'>Aktif filtreler:</span>
      {filters.status && filters.status !== 'all' && (
        <Badge color='info' variant='outline' className='text-xs'>
          {statusOptions?.find(s => s.value === filters.status)?.label ?? filters.status}
        </Badge>
      )}
      {filters.search && (
        <Badge color='info' variant='outline' className='text-xs'>
          Arama: &quot;{filters.search}&quot;
        </Badge>
      )}
      {filters.dateFrom && (
        <Badge color='info' variant='outline' className='text-xs'>
          Başlangıç: {filters.dateFrom}
        </Badge>
      )}
      {filters.dateTo && (
        <Badge color='info' variant='outline' className='text-xs'>
          Bitiş: {filters.dateTo}
        </Badge>
      )}
    </div>
  )
}
