'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FlameIcon } from 'lucide-react'
import { useOrders } from '../../context/OrdersContext'

export function OrdersPendingAlert() {
  const { stats, handleStatusFilterChange } = useOrders()

  if (stats.created === 0) return null

  return (
    <Alert variant='outline' color='warning'>
      <FlameIcon className='h-4 w-4 text-orange-600!' />
      <AlertDescription className='flex items-center justify-between'>
        <div>
          <p className='font-medium'> {stats.created} sipariş beklemede!</p>
          <p className='text-sm'>Beklemede olan siparişler kırmızı çerçeve ile vurgulanmıştır.</p>
        </div>
        <Button color='warning' onClick={() => handleStatusFilterChange(['created'])}>
          Bekleyenleri Göster
        </Button>
      </AlertDescription>
    </Alert>
  )
}
