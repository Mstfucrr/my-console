'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Edit } from 'lucide-react'

interface WorkingHour {
  day: string
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
}

interface WorkingHoursCardProps {
  workingHours: WorkingHour[]
  onWorkingHoursUpdate: (hours: WorkingHour[]) => void
}

export default function WorkingHoursCard({ workingHours }: WorkingHoursCardProps) {
  return (
    <>
      <Card className='h-[320px]'>
        <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 pb-2'>
          <CardTitle className='flex items-center gap-2 max-sm:text-base'>
            <Clock className='h-5 w-5 text-green-600' />
            Çalışma Saatleri
          </CardTitle>
          <Button className='flex items-center gap-2' variant='outline' disabled>
            <Edit className='h-4 w-4' />
            <span className='max-sm:hidden'>Düzenle</span> (Yakında)
          </Button>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </>
  )
}
