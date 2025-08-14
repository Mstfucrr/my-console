'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Edit, MapPin } from 'lucide-react'

interface WorkingArea {
  id: string
  name: string
  type: 'polygon' | 'neighborhood'
  coordinates?: number[][]
  neighborhoods?: string[]
  isActive: boolean
}

interface WorkingAreaSettingsCardProps {
  workingAreas: WorkingArea[]
  onWorkingAreaUpdate: (id: string, data: Partial<WorkingArea>) => void
}

export default function WorkingAreaSettingsCard({ workingAreas, onWorkingAreaUpdate }: WorkingAreaSettingsCardProps) {
  return (
    <>
      <Card className='h-[320px]'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='flex items-center gap-2'>
            <MapPin className='h-5 w-5 text-orange-600' />
            Çalışma Alanı Ayarları
          </CardTitle>
          <Button size='xs' variant='outline' disabled>
            <Edit className='mr-2 h-4 w-4' />
            Düzenle (Yakında)
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[200px]'>
            <div className='space-y-3'>
              {workingAreas.map(area => (
                <div key={area.id} className='rounded-lg border p-3'>
                  <div className='mb-2 flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>{area.name}</p>
                      <Badge variant='outline' color={area.type === 'polygon' ? 'info' : 'success'} className='text-xs'>
                        {area.type === 'polygon' ? 'Poligon' : 'Mahalle'}
                      </Badge>
                    </div>
                    <Switch
                      checked={area.isActive}
                      onCheckedChange={checked => onWorkingAreaUpdate(area.id, { isActive: checked })}
                    />
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
        </CardContent>
      </Card>
    </>
  )
}
