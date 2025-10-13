import { Motorcycle } from '@/components/svg'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { CourierInfo } from '@/modules/types'
import { MapPinned } from 'lucide-react'

type Props = {
  courierInfo: CourierInfo
  showCourierTracking: boolean
  handleToggleMap: () => void
}

/**
 * Farklı yaklaşım:
 * - Tek satır başlıkta: Avatar ○ İsim • Plaka pill • Durum pill • Aksiyon
 * - Alt satırda (varsa) küçük meta: araç tipi / kısa açıklama
 * - Bilgiler tekrar etmiyor; etiketler opsiyonel.
 */
export default function CourierCardPeek({ courierInfo, showCourierTracking, handleToggleMap }: Props) {
  const hasPlate = Boolean(courierInfo?.licensePlate)

  return (
    <Card className='mb-4 border bg-white p-4'>
      {/* Üst satır: tek bakışta özet */}
      <div className='flex items-center gap-3 max-sm:flex-col'>
        <div className='flex items-center gap-3'>
          {/* Avatar / Baş harf */}
          <div className='bg-muted text-muted-foreground grid size-10 place-items-center rounded-full text-sm font-semibold max-sm:hidden'>
            <Motorcycle className='opacity-70' />
          </div>

          {/* İsim + pill'ler */}
          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-2'>
              <h3 className='truncate text-base font-semibold tracking-tight'>{courierInfo?.name || 'Kurye'}</h3>

              {hasPlate && (
                <Badge variant='outline' className='rounded-full px-2 py-0.5 text-[11px]'>
                  {courierInfo.licensePlate}
                </Badge>
              )}

              {/* Durum: sadece izleme açıkken göster */}
              {showCourierTracking && (
                <span className='rounded-full border bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700'>
                  Yolda
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tek aksiyon: haritada gör */}
        <Button size='sm' variant='outline' onClick={handleToggleMap} className='gap-1'>
          <MapPinned className='h-4 w-4' />
          Haritada Gör
        </Button>
      </div>
    </Card>
  )
}
