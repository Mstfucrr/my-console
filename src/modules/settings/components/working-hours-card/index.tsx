'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Edit } from 'lucide-react'
import { WorkingHoursList } from './WorkingHoursList'
import type { WorkingHour } from './types'

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
          <WorkingHoursList workingHours={workingHours} />
        </CardContent>
      </Card>
    </>
  )
}
