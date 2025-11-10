'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, LucideIcon, XCircle } from 'lucide-react'
import { ReactNode } from 'react'
import type { DateRange } from 'react-day-picker'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterProperties {
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface FilterConfig {
  title: string
  icon: LucideIcon
  statusOptions?: FilterOption[]
  showDateFilters?: boolean
}

export interface FilterCardProps<T> {
  config: FilterConfig
  filters: T
  onFiltersChange: (filters: T) => void
  onClearFilters: () => void
  onApply?: () => void
  hasActiveFilters: boolean
  hasPendingChanges?: boolean
  children?: ReactNode
}

export function FilterCard<T>({
  config,
  onClearFilters,
  onApply,
  hasActiveFilters,
  hasPendingChanges = false,
  children
}: FilterCardProps<T>) {
  const { title, icon: Icon } = config

  return (
    <Card className='mb-4'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <div className='flex items-center gap-2'>
          <Icon className='text-amber-400' />
          <CardTitle className='text-base'>{title}</CardTitle>
        </div>
        <div className='flex items-center gap-2'>
          {hasPendingChanges && onApply && (
            <Button size='xs' onClick={onApply}>
              <Check className='mr-1 h-4 w-4' />
              Uygula
            </Button>
          )}
          {hasActiveFilters && (
            <Button size='xs' variant='outline' onClick={onClearFilters}>
              <XCircle className='mr-1 h-4 w-4' />
              Temizle
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function SearchInput({
  placeholder,
  value,
  onChange,
  showLabel = true,
  Icon
}: {
  placeholder: string
  value: string
  onChange: (value: string | undefined) => void
  showLabel?: boolean
  Icon: LucideIcon
}) {
  const isActive = value && value.length > 0

  return (
    <div>
      {showLabel && <label className='text-muted-foreground mb-1 block text-xs'>Arama</label>}
      <div className='relative'>
        <Input
          Icon={Icon}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          size='sm'
          color={isActive ? 'info' : undefined}
          variant={isActive ? 'faded' : 'bordered'}
        />
        {value && value.length > 0 && (
          <Button
            size='icon-xs'
            variant='ghost'
            onClick={() => onChange(undefined)}
            className='absolute top-0 right-0 h-full'
          >
            <XCircle className='h-4 w-4' />
            <span className='sr-only'>Temizle</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export function StatusSelect({
  options,
  value,
  onChange,
  placeholder = 'Durum',
  showLabel = true
}: {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showLabel?: boolean
}) {
  const isActive = value && value !== 'all'

  return (
    <div>
      {showLabel && <label className='text-muted-foreground mb-1 block text-xs'>Durum</label>}
      <div className='flex flex-wrap items-center gap-2'>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className='min-w-[180px]'
            size='sm'
            color={isActive ? 'info' : undefined}
            variant={isActive ? 'faded' : 'bordered'}
          >
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
  dateRange,
  onDateRangeChange,
  placeholder = 'Tarih aralığı seçin',
  showLabel = true
}: {
  dateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
  placeholder?: string
  showLabel?: boolean
}) {
  const isActive = dateRange && (dateRange.from || dateRange.to)

  return (
    <div>
      {showLabel && <label className='text-muted-foreground mb-1 block text-xs'>Tarih Aralığı</label>}
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        placeholder={placeholder}
        size='xs'
        color={isActive ? 'info' : undefined}
        variant={isActive ? 'soft' : 'outline'}
      />
    </div>
  )
}
