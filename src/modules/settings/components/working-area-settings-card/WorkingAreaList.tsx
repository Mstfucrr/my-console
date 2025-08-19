'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { memo } from 'react'

import type { WorkingArea } from './types'

interface WorkingAreaListProps {
  areas: WorkingArea[]
  onToggle: (id: string, checked: boolean) => void
}

export const WorkingAreaList = memo(function WorkingAreaList({ areas, onToggle }: WorkingAreaListProps) {
  return (
    <ScrollArea className='h-[200px]'>
      <div className='space-y-3'>
        {areas.map(area => (
          <div key={area.id} className='rounded-lg border p-3'>
            <div className='mb-2 flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>{area.name}</p>
                <Badge variant='outline' color={area.type === 'polygon' ? 'info' : 'success'} className='text-xs'>
                  {area.type === 'polygon' ? 'Poligon' : 'Mahalle'}
                </Badge>
              </div>
              <Switch checked={area.isActive} onCheckedChange={checked => onToggle(area.id, checked)} />
            </div>
            {area.neighborhoods && (
              <p className='text-muted-foreground text-xs'>
                {area.neighborhoods.slice(0, 3).join(', ')}
                {area.neighborhoods.length > 3 && ` +${area.neighborhoods.length - 3} daha`}
              </p>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
})
