'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Building2, Map } from 'lucide-react'

import type { WorkingArea } from './types'

interface AreaTypeStepProps {
  selected: WorkingArea | null
  setSelected: (wa: WorkingArea) => void
  goNext: () => void
}

export function AreaTypeStep({ selected, setSelected, goNext }: AreaTypeStepProps) {
  return (
    <div className='text-center'>
      <h3 className='mb-6 text-lg font-semibold'>Çalışma Alanı Tipi Seçin</h3>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card
          className={cn('cursor-pointer transition-shadow hover:shadow-md', {
            'bg-primary/10': selected?.type === 'polygon'
          })}
          onClick={() => {
            setSelected({ id: '', name: '', type: 'polygon', coordinates: [], isActive: true })
            goNext()
          }}
        >
          <CardContent className='px-2 py-4 text-center'>
            <Map className='mx-auto mb-4 h-12 w-12 text-blue-600' />
            <h4 className='mb-2 font-medium'>Poligon Çizimi</h4>
            <p className='text-muted-foreground text-sm'>Harita üzerinde manuel olarak alan çizin</p>
          </CardContent>
        </Card>

        <Card
          className={cn('cursor-pointer transition-shadow hover:shadow-md', {
            'bg-primary/10': selected?.type === 'neighborhood'
          })}
          onClick={() => {
            setSelected({ id: '', name: '', type: 'neighborhood', neighborhoods: [], isActive: true })
            goNext()
          }}
        >
          <CardContent className='px-2 py-4 text-center'>
            <Building2 className='mx-auto mb-4 h-12 w-12 text-green-600' />
            <h4 className='mb-2 font-medium'>Mahalle Seçimi</h4>
            <p className='text-muted-foreground text-sm'>Hazır mahalle listesinden seçim yapın</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
