'use client'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { Button, ButtonProps } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  enableTimeSelection?: boolean
  onApply?: () => void
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = 'Tarih aralığı seçin',
  className,
  enableTimeSelection = false,
  onApply,
  ...props
}: DateRangePickerProps & ButtonProps) {
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(dateRange)
  const [fromTime, setFromTime] = useState<string>('')
  const [toTime, setToTime] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  // Initialize time inputs from existing dateRange
  useEffect(() => {
    setTempDateRange(dateRange)

    if (dateRange?.from) {
      const fromHours = dateRange.from.getHours().toString().padStart(2, '0')
      const fromMinutes = dateRange.from.getMinutes().toString().padStart(2, '0')
      setFromTime(`${fromHours}:${fromMinutes}`)
    } else {
      setFromTime('')
    }

    if (dateRange?.to) {
      const toHours = dateRange.to.getHours().toString().padStart(2, '0')
      const toMinutes = dateRange.to.getMinutes().toString().padStart(2, '0')
      setToTime(`${toHours}:${toMinutes}`)
    } else {
      setToTime('')
    }
  }, [dateRange])

  const handleDateSelect = (range: DateRange | undefined) => {
    setTempDateRange(range)
  }

  const handleApply = () => {
    if (tempDateRange) {
      const finalRange: DateRange = { ...tempDateRange }

      if (enableTimeSelection && fromTime && tempDateRange.from) {
        const [hours, minutes] = fromTime.split(':').map(Number)
        finalRange.from = new Date(tempDateRange.from)
        finalRange.from.setHours(hours, minutes, 0, 0)
      }

      if (enableTimeSelection && toTime && tempDateRange.to) {
        const [hours, minutes] = toTime.split(':').map(Number)
        finalRange.to = new Date(tempDateRange.to)
        finalRange.to.setHours(hours, minutes, 0, 0)
      }

      onDateRangeChange(finalRange)
    }
    onApply?.()
    setIsOpen(false)
  }

  const formatDisplayDate = (date: Date) => {
    if (enableTimeSelection) {
      return format(date, 'dd MMM yyyy HH:mm', { locale: tr })
    }
    return format(date, 'dd MMM yyyy', { locale: tr })
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant='outline'
            size='sm'
            className={cn('w-full justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
            {...props}
          >
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
              mode='range'
              defaultMonth={tempDateRange?.from}
              selected={tempDateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              locale={tr}
            />

            {enableTimeSelection && (
              <div className='mt-4 space-y-3 border-t pt-3'>
                <div className='grid grid-cols-2 gap-3'>
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
