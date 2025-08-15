'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Pause, Play, Store } from 'lucide-react'
import { useState } from 'react'

interface RestaurantStatusCardProps {
  isOpen: boolean
  onStatusChange: (isOpen: boolean, duration?: string) => void
}

const durations = [
  { label: '30 Dakika', value: '30dk' },
  { label: '1 Saat', value: '1saat' },
  { label: '4 Saat', value: '4saat' },
  { label: 'Ertesi Güne Kadar', value: 'ertesi_gun' }
]

export default function RestaurantStatusCard({ isOpen, onStatusChange }: RestaurantStatusCardProps) {
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false)

  const handleStatusToggle = () => {
    if (isOpen) {
      setStatusPopoverOpen(true)
    } else {
      onStatusChange(true)
    }
  }

  const handleStatusChange = (duration: string) => {
    onStatusChange(false, duration)
    setStatusPopoverOpen(false)
  }

  return (
    <Card>
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
          {isOpen ? (
            <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant='outline' color='destructive' className='ml-4'>
                  <Pause className='mr-2 h-4 w-4' />
                  Restoranı Kapat
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-52'>
                <div className='space-y-4'>
                  <p className='text-muted-foreground text-sm'>Ne kadar süre kapalı kalacaksınız?</p>
                  <Separator />
                  <div className='flex flex-col gap-2'>
                    {durations.map(duration => (
                      <Button
                        variant='outline'
                        className='w-full justify-start'
                        onClick={() => handleStatusChange(duration.value)}
                        key={duration.value}
                      >
                        <span className='text-xs'>{duration.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant='outline' color='success' onClick={handleStatusToggle} className='ml-4'>
              <Play className='mr-2 h-4 w-4' />
              Restoranı Aç
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
