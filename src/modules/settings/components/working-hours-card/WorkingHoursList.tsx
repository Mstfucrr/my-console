'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { memo } from 'react'

import type { WorkingHour } from './types'

interface WorkingHoursListProps {
  workingHours: WorkingHour[]
}

export const WorkingHoursList = memo(function WorkingHoursList({ workingHours }: WorkingHoursListProps) {
  return (
    <ScrollArea className='h-[200px] pr-3'>
      <div className='space-y-2'>
        {workingHours.map(hour => (
          <div key={hour.day} className='flex items-center justify-between py-1'>
            <span className='text-sm font-medium'>{hour.day}</span>
            <span className={`text-sm ${hour.isOpen ? 'text-muted-foreground' : 'text-red-600'}`}>
              {hour.isOpen ? `${hour.openTime} - ${hour.closeTime}` : 'Kapalı'}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
})
