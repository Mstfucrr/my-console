'use client'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { startTransition, useEffect, useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { Button, ButtonProps } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  defaultDateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  enableTimeSelection?: boolean
  onApply?: () => void
  calendarProps?: React.ComponentProps<typeof Calendar>
}

function setDateTimeToLocal(date: Date, hours: number, minutes: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0, 0)
}

function getDisplayDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0)
}

export function DateRangePicker({
  dateRange,
  defaultDateRange,
  onDateRangeChange,
  placeholder = 'Tarih aralığı seçin',
  className,
  enableTimeSelection = false,
  onApply,
  calendarProps,
  ...props
}: DateRangePickerProps & ButtonProps) {
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(dateRange)

  useEffect(() => {
    startTransition(() => setTempDateRange(dateRange))
  }, [dateRange])

  const derivedFromTime = useMemo(() => {
    if (!dateRange || !dateRange.from) return ''
    const fromHours = dateRange.from.getHours().toString().padStart(2, '0')
    const fromMinutes = dateRange.from.getMinutes().toString().padStart(2, '0')
    return `${fromHours}:${fromMinutes}`
  }, [dateRange])

  const derivedToTime = useMemo(() => {
    if (!dateRange || !dateRange.to) return ''
    const toHours = dateRange.to.getHours().toString().padStart(2, '0')
    const toMinutes = dateRange.to.getMinutes().toString().padStart(2, '0')
    return `${toHours}:${toMinutes}`
  }, [dateRange])

  const [fromTime, setFromTime] = useState<string>(derivedFromTime)
  const [toTime, setToTime] = useState<string>(derivedToTime)

  useEffect(() => {
    startTransition(() => setFromTime(derivedFromTime))
  }, [derivedFromTime])

  useEffect(() => {
    startTransition(() => setToTime(derivedToTime))
  }, [derivedToTime])

  const [isOpen, setIsOpen] = useState(false)

  const handleDateSelect = (range: DateRange | undefined) => {
    setTempDateRange(range)
  }

  const handleApply = () => {
    if (tempDateRange) {
      const finalRange: DateRange = { ...tempDateRange }

      if (enableTimeSelection && fromTime && tempDateRange.from) {
        const [hours, minutes] = fromTime.split(':').map(Number)
        finalRange.from = setDateTimeToLocal(tempDateRange.from, hours, minutes)
      }

      if (enableTimeSelection && toTime && tempDateRange.to) {
        const [hours, minutes] = toTime.split(':').map(Number)
        finalRange.to = setDateTimeToLocal(tempDateRange.to, hours, minutes)
      }

      onDateRangeChange(finalRange)
    }
    onApply?.()
    setIsOpen(false)
  }

  const formatDisplayDate = (date: Date) => {
    const displayDate = getDisplayDate(date)
    if (enableTimeSelection) return format(displayDate, 'dd MMM yyyy HH:mm', { locale: tr })

    return format(displayDate, 'dd MMM yyyy', { locale: tr })
  }

  const handleClear = () => {
    setTempDateRange(defaultDateRange)
    onDateRangeChange(defaultDateRange)
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button id='date' variant='outline' className='font-normal' size='sm' {...props}>
            <CalendarIcon className='mr-2 h-4 w-4' />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {formatDisplayDate(dateRange.from)} - {formatDisplayDate(dateRange.to)}
                </>
              ) : (
                formatDisplayDate(dateRange.from)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <div className='p-3'>
            <Calendar
              numberOfMonths={2}
              defaultMonth={tempDateRange?.from}
              locale={tr}
              {...calendarProps}
              selected={tempDateRange}
              mode='range'
              onSelect={handleDateSelect}
            />

            {enableTimeSelection && (
              <div className='mt-4 space-y-3 border-t pt-3'>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  <div>
                    <Label htmlFor='from-time' className='text-xs'>
                      Başlangıç Saati
                    </Label>
                    <Input
                      id='from-time'
                      type='time'
                      value={fromTime}
                      onChange={e => setFromTime(e.target.value)}
                      className='h-8'
                    />
                  </div>
                  <div>
                    <Label htmlFor='to-time' className='text-xs'>
                      Bitiş Saati
                    </Label>
                    <Input
                      id='to-time'
                      type='time'
                      value={toTime}
                      onChange={e => setToTime(e.target.value)}
                      className='h-8'
                    />
                  </div>
                </div>
              </div>
            )}

            <div className='mt-4 flex justify-end gap-2'>
              {dateRange && dateRange !== defaultDateRange && (
                <Button variant='outline' size='xs' onClick={handleClear}>
                  Temizle
                </Button>
              )}
              <Button variant='outline' size='xs' onClick={() => setIsOpen(false)}>
                İptal
              </Button>
              <Button size='xs' onClick={handleApply}>
                Uygula
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
