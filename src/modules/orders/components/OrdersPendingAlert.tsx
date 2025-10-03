'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'

export function OrdersPendingAlert() {
  const { stats, handleStatClick } = useOrders()

  if (stats.created === 0) return null

  return (
    <Alert variant='outline' color='warning'>
      <AlertTriangle className='h-4 w-4 text-orange-600' />
      <AlertDescription className='flex items-center justify-between'>
        <div>
          <p className='font-medium'>🔥 {stats.created} sipariş kabul edilmeyi bekliyor!</p>
          <p className='text-sm'>
            Beklemede olan siparişler kırmızı çerçeve ile vurgulanmıştır. Hemen işleme alınması gerekmektedir.
          </p>
        </div>
        <Button color='warning' onClick={() => handleStatClick(['created'])}>
          Bekleyenleri Göster
        </Button>
      </AlertDescription>
    </Alert>
  )
}
