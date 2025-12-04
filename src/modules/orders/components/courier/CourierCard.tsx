import { Motorcycle } from '@/components/svg'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { CourierInfo } from '@/types'
import { MapPinned } from 'lucide-react'

type Props = {
  courierInfo: CourierInfo
  handleToggleMap: () => void
}

/**
 * Farklı yaklaşım:
 * - Tek satır başlıkta: Avatar ○ İsim • Plaka pill • Durum pill • Aksiyon
 * - Alt satırda (varsa) küçük meta: araç tipi / kısa açıklama
 * - Bilgiler tekrar etmiyor; etiketler opsiyonel.
 */
export default function CourierCardPeek({ courierInfo, handleToggleMap }: Props) {
  const hasPlate = Boolean(courierInfo?.licensePlate)

  return (
    <Card className='mb-4 border bg-white p-4'>
      {/* Üst satır: tek bakışta özet */}
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          {/* Avatar / Baş harf */}
          <div className='bg-muted text-muted-foreground grid size-10 place-items-center rounded-full text-sm font-semibold'>
            <Motorcycle className='opacity-70' />
          </div>

          {/* İsim + pill'ler */}
          <div className='min-w-0 flex-1'>
            <div className='flex flex-col items-start gap-y-1'>
              <h3 className='truncate text-base font-semibold tracking-tight'>{courierInfo?.name || 'Kurye'}</h3>

              {hasPlate && (
                <Badge variant='outline' color='secondary' className='rounded-full px-2 py-0.5'>
                  {courierInfo.licensePlate}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tek aksiyon: haritada gör */}
        <Button size='sm' variant='outline' onClick={handleToggleMap} className='gap-1'>
          <MapPinned className='h-4 w-4' />
          <span className='max-sm:sr-only'>Haritada Gör</span>
        </Button>
      </div>
    </Card>
  )
}
