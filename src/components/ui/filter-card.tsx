'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { isSameDateRange } from '@/lib/utils/date'
import { Check, ChevronDown, Filter, LucideIcon, XCircle } from 'lucide-react'
import { Children, cloneElement, isValidElement, ReactNode } from 'react'
import type { DateRange } from 'react-day-picker'
import { TooltippedElement } from '../tooltipped-element'

export interface FilterOption {
  value: string | number
  label: string | number
}

export interface GroupedFilterOption {
  groupLabel?: string
  items: FilterOption[]
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
  // Children'a otomatik olarak onEnterPress ekle
  const enhancedChildren = Children.map(children, child => {
    if (!isValidElement(child)) return child

    // SearchInput veya StatusSelect ise onEnterPress ekle
    const componentName = child.type?.toString() || ''
    const isSearchInput = componentName.includes('SearchInput') || child.type === SearchInput
    const isStatusSelect = componentName.includes('StatusSelect') || child.type === StatusSelect

    if ((isSearchInput || isStatusSelect) && hasPendingChanges && onApply) {
      const existingProps = child.props as Record<string, unknown>
      return cloneElement(child, {
        ...existingProps,
        onEnterPress: onApply
      } as Partial<typeof existingProps & { onEnterPress: () => void }>)
    }

    return child
  })

  return (
    <div className={cn('flex w-full justify-end gap-2 pt-2 max-lg:flex-wrap-reverse', className)}>
      <div className='flex w-full flex-wrap justify-end gap-2'>
        {enhancedChildren}

        {(hasPendingChanges || hasActiveFilters) && (
          <div className='flex items-center gap-2'>
            {hasPendingChanges && onApply && (
              <TooltippedElement tooltipContent='Filtreleri Uygula'>
                <Button size='icon-sm' onClick={onApply}>
                  <Check className='size-4.5' />
                  <span className='sr-only'>Uygula</span>
                </Button>
              </TooltippedElement>
            )}
            {hasActiveFilters && (
              <TooltippedElement tooltipContent='Filtreleri Temizle'>
                <Button size='icon-sm' variant='outline' onClick={onClearFilters}>
                  <XCircle className='size-4.5' />
                  <span className='sr-only'>Temizle</span>
                </Button>
              </TooltippedElement>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function SearchInput({
  placeholder,
  value,
  onChange,
  showLabel = false,
  className,
  Icon,
  onEnterPress
}: {
  placeholder: string
  value: string
  onChange: (value: string | undefined) => void
  showLabel?: boolean
  className?: string
  Icon: LucideIcon
  onEnterPress?: () => void
}) {
  const isActive = value && value.length > 0

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnterPress) {
      e.preventDefault()
      onEnterPress()
    }
  }

  return (
    <div className={cn('flex-1', className)}>
      {showLabel && <label className='text-muted-foreground mb-1 block text-xs'>Arama</label>}
      <div className='relative'>
        <Input
          Icon={Icon}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
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

export function StatusSelect<T extends string | number>({
  options,
  groupedOptions,
  value,
  onChange,
  placeholder = 'Durum',
  showLabel = false,
  onEnterPress
}: {
  options?: FilterOption[]
  groupedOptions?: GroupedFilterOption[]
  value: T | undefined
  onChange: (value: T) => void
  placeholder?: string
  showLabel?: boolean
  onEnterPress?: () => void
}) {
  const isActive = value && value !== 'all'
  const hasOptions = groupedOptions ? groupedOptions.some(g => g.items.length > 0) : (options?.length ?? 0) > 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Select açık değilse ve Enter basıldıysa filtreleri uygula
    if (e.key === 'Enter' && onEnterPress) {
      // Select açık mı kontrol et
      const selectContent = document.querySelector('[role="listbox"]')
      const isSelectOpen = selectContent?.getAttribute('data-state') === 'open'

      if (!isSelectOpen) {
        // Select kapalıyken Enter basıldığında filtreleri uygula ve Select'in açılmasını engelle
        e.preventDefault()
        e.stopPropagation()
        onEnterPress()
      }
      // Select açıksa normal davranışına izin ver (seçim yapılabilir)
    }
  }

  return (
    <div className='max-sm:w-full'>
      {showLabel && <label className='text-muted-foreground mb-1 block text-xs'>Durum</label>}
      <div className='flex flex-wrap items-center gap-2'>
        <Select value={value?.toString()} onValueChange={value => onChange(value as T)}>
          <SelectTrigger
            className='min-w-[180px]'
            size='sm'
            color={isActive ? 'info' : undefined}
            variant={isActive ? 'faded' : 'bordered'}
            onKeyDown={handleKeyDown}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {hasOptions ? (
              <div className='max-h-48 overflow-y-auto pr-0.5'>
                {groupedOptions
                  ? groupedOptions.map((group, index) => (
                      <SelectGroup key={`${group.groupLabel}-${index}`}>
                        {group.groupLabel && <SelectLabel>{group.groupLabel}</SelectLabel>}
                        {group.items.map(option => (
                          <SelectItem key={`${option.value}-${option.label}`} value={option.value?.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))
                  : options?.map(option => (
                      <SelectItem key={`${option.value}-${option.label}`} value={option.value?.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
              </div>
            ) : (
              <div className='text-muted-foreground flex items-center justify-center p-2 text-sm'>
                Bir sonuç bulunamadı.
              </div>
            )}
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
    <TooltippedElement tooltipContent={`Filtreleri ${showFilters ? 'gizle' : 'göster'}`}>
      <Button className='relative' onClick={onToggle} size='icon-sm' {...props}>
        <Filter className='mr-1 size-4.5' />
        <ChevronDown className={cn('absolute right-0 bottom-0 size-4.5', showFilters ? 'rotate-180' : 'rotate-0')} />
      </Button>
    </TooltippedElement>
  )
}
