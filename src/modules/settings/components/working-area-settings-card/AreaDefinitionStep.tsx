'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, ArrowRight, Map } from 'lucide-react'

import type { WorkingArea } from './types'

interface AreaDefinitionStepProps {
  selected: WorkingArea
  selectedNeighborhoods: string[]
  toggleNeighborhood: (n: string) => void
  goBack: () => void
  goNext: () => void
}

export function AreaDefinitionStep({
  selected,
  selectedNeighborhoods,
  toggleNeighborhood,
  goBack,
  goNext
}: AreaDefinitionStepProps) {
  const demoNeighborhoods = [
    'Acıbadem',
    'Caferağa',
    'Caddebostan',
    'Erenköy',
    'Fenerbahçe',
    'Göztepe',
    'Kozyatağı',
    'Sahrayıcedit'
  ]

  const canProceed =
    selected.type === 'polygon' || (selected.type === 'neighborhood' && selectedNeighborhoods.length > 0)

  return (
    <div className='space-y-4'>
      {selected.type === 'polygon' ? (
        <>
          <div className='text-center'>
            <h3 className='mb-2 text-lg font-semibold'>Harita Üzerinde Alan Çizin</h3>
          </div>
          <div className='border-muted bg-muted/50 rounded-lg border-2 border-dashed p-8 text-center'>
            <Map className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <p className='text-muted-foreground mb-4'>Harita entegrasyonu yakında aktif olacak</p>
            <Button onClick={goNext}>Demo Alan Ekle</Button>
          </div>
        </>
      ) : (
        <div>
          <h4 className='mb-4 font-medium'>Mahalle Seçimi</h4>
          <div className='grid grid-cols-2 gap-2'>
            {demoNeighborhoods.map(n => (
              <div key={n} className='flex items-center space-x-2'>
                <Checkbox
                  id={n}
                  checked={selectedNeighborhoods.includes(n)}
                  onCheckedChange={() => toggleNeighborhood(n)}
                />
                <label htmlFor={n} className='cursor-pointer text-sm'>
                  {n}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='flex justify-between pt-4'>
        <Button type='button' variant='outline' onClick={goBack}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Geri
        </Button>
        <Button onClick={goNext} disabled={!canProceed}>
          İleri
          <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
