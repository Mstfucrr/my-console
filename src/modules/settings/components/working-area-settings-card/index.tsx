'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, MapPin } from 'lucide-react'
import { useState } from 'react'
import { WorkingAreaList } from './WorkingAreaList'
import { WorkingAreaModal } from './WorkingAreaModal'
import type { WorkingArea } from './types'

interface WorkingAreaSettingsCardProps {
  workingAreas: WorkingArea[]
  onWorkingAreaUpdate: (id: string, data: Partial<WorkingArea>) => void
  onWorkingAreaAdd: (area: WorkingArea) => void
}

export default function WorkingAreaSettingsCard({
  workingAreas,
  onWorkingAreaUpdate,
  onWorkingAreaAdd
}: WorkingAreaSettingsCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Card className='h-[320px]'>
        <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 pb-2'>
          <CardTitle className='flex items-center gap-2 max-sm:text-base'>
            <MapPin className='h-5 w-5 text-orange-600' />
            Çalışma Alanı Ayarları
          </CardTitle>
          <Button className='flex items-center gap-2' variant='outline' onClick={() => setModalOpen(true)}>
            <Edit className='h-4 w-4' />
            <span className='max-sm:hidden'>Düzenle</span>
          </Button>
        </CardHeader>
        <CardContent>
          <WorkingAreaList
            areas={workingAreas}
            onToggle={(id, checked) => onWorkingAreaUpdate(id, { isActive: checked })}
          />
        </CardContent>
      </Card>

      <WorkingAreaModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={onWorkingAreaAdd} />
    </>
  )
}
