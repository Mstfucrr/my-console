'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { isSameDateRange } from '@/lib/utils/date'
import { Check, ChevronDown, Filter, LucideIcon, XCircle } from 'lucide-react'
import { ReactNode } from 'react'
import type { DateRange } from 'react-day-picker'

export interface FilterOption {
  value: string | number
  label: string | number
}

export interface FilterProperties {
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface FilterCardProps<T> {
  filters: T
  onFiltersChange: (filters: T) => void
  onClearFilters: () => void
  onApply?: () => void
  hasActiveFilters: boolean
  hasPendingChanges?: boolean
  children?: ReactNode
  className?: string
}

export function FilterCard<T>({
  onClearFilters,
  onApply,
  hasActiveFilters,
  hasPendingChanges = false,
  children,
  className
}: FilterCardProps<T>) {
  return (
    <div className={cn('flex w-full justify-end gap-2 pt-2 max-lg:flex-wrap', className)}>
      <div className='flex w-full flex-wrap justify-end gap-2'>{children}</div>
      {(hasPendingChanges || hasActiveFilters) && (
        <div className='flex items-center gap-2'>
          {hasPendingChanges && onApply && (
            <Button size='icon-sm' onClick={onApply}>
              <Check className='size-4.5' />
              <span className='sr-only'>Uygula</span>
            </Button>
          )}
          {hasActiveFilters && (
            <Button size='icon-sm' variant='outline' onClick={onClearFilters}>
              <XCircle className='size-4.5' />
              <span className='sr-only'>Temizle</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export function SearchInput({
  placeholder,
  value,
  onChange,
  showLabel = false,
  className,
  Icon
}: {
  placeholder: string
  value: string
  onChange: (value: string | undefined) => void
  showLabel?: boolean
  className?: string
  Icon: LucideIcon
}) {
  const isActive = value && value.length > 0

  return (
    <div className={cn('flex-1', className)}>
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
          className='w-full min-w-[180px]'
        />
        {value && value.length > 0 && (
          <Button
            size='icon-xs'
            variant='ghost'
            onClick={() => onChange(undefined)}
            className='absolute top-1/2 right-0 -translate-y-1/2'
          >
            <XCircle className='size-5' />
            <span className='sr-only'>Temizle</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export function StatusSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = 'Durum',
  showLabel = false
}: {
  options: FilterOption[]
  value: T | undefined
  onChange: (value: T) => void
  placeholder?: string
  showLabel?: boolean
}) {
  const isActive = value && value !== 'all'

  return (
    <div className='max-sm:w-full'>
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
              <SelectItem key={`${option.value}-${option.label}`} value={option.value?.toString()}>
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
  showLabel = false,
  defaultDateRange,
  ...props
}: {
  dateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
  placeholder?: string
  showLabel?: boolean
  defaultDateRange?: DateRange
} & React.ComponentProps<typeof DateRangePicker>) {
  const isDefaultDateRange = isSameDateRange(dateRange, defaultDateRange)
  const isActive = dateRange && (dateRange.from || dateRange.to) && !isDefaultDateRange

  return (
    <div>
      {showLabel && <label className='text-muted-foreground mb-1 block text-xs'>Tarih Aralığı</label>}
      <DateRangePicker
        dateRange={dateRange}
        defaultDateRange={defaultDateRange}
        onDateRangeChange={onDateRangeChange}
        placeholder={placeholder}
        size='xs'
        color={isActive ? 'info' : undefined}
        variant={isActive ? 'soft' : 'outline'}
        {...props}
      />
    </div>
  )
}

export function FilterToggleButton({
  showFilters,
  onToggle,
  ...props
}: {
  showFilters: boolean
  onToggle: () => void
} & ButtonProps) {
  return (
    <Button className='relative' onClick={onToggle} size='icon-sm' {...props}>
      <Filter className='mr-1 size-4.5' />
      <ChevronDown className={cn('absolute right-0 bottom-0 size-4.5', showFilters ? 'rotate-180' : 'rotate-0')} />
    </Button>
  )
}
