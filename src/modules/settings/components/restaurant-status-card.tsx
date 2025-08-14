'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Pause, Play, Store } from 'lucide-react'
import { useState } from 'react'

interface RestaurantStatusCardProps {
  isOpen: boolean
  onStatusChange: (isOpen: boolean, duration?: string) => void
}

export default function RestaurantStatusCard({ isOpen, onStatusChange }: RestaurantStatusCardProps) {
  const [statusModalOpen, setStatusModalOpen] = useState(false)

  const handleStatusToggle = () => {
    if (isOpen) {
      setStatusModalOpen(true)
    } else {
      onStatusChange(true)
    }
  }

  const handleStatusChange = (duration: string) => {
    onStatusChange(false, duration)
    setStatusModalOpen(false)
  }

  return (
    <>
      <Card className='mb-6'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='flex items-center gap-2'>
            <Store className={`h-5 w-5 ${isOpen ? 'text-green-600' : 'text-red-600'}`} />
            Restoran Durumu
          </CardTitle>
          <Badge variant='outline' color={isOpen ? 'success' : 'destructive'}>
            {isOpen ? 'AÇIK' : 'KAPALI'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <p className='text-muted-foreground text-sm'>
              Restoranınız şu anda <span className='font-semibold'>{isOpen ? 'açık' : 'kapalı'}</span> durumda.
            </p>
            <Button
              variant='outline'
              color={isOpen ? 'success' : 'destructive'}
              onClick={handleStatusToggle}
              className='ml-4'
            >
              {isOpen ? (
                <>
                  <Pause className='mr-2 h-4 w-4' />
                  Restoranı Kapat
                </>
              ) : (
                <>
                  <Play className='mr-2 h-4 w-4' />
                  Restoranı Aç
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restoran Kapatma Süresi</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p className='text-muted-foreground text-sm'>Ne kadar süre kapalı kalacaksınız?</p>
            <Separator />
            <div className='space-y-2'>
              <Button variant='outline' className='w-full justify-start' onClick={() => handleStatusChange('30dk')}>
                30 Dakika
              </Button>
              <Button variant='outline' className='w-full justify-start' onClick={() => handleStatusChange('1saat')}>
                1 Saat
              </Button>
              <Button variant='outline' className='w-full justify-start' onClick={() => handleStatusChange('4saat')}>
                4 Saat
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => handleStatusChange('ertesi_gun')}
              >
                Ertesi Güne Kadar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
