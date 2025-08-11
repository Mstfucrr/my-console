'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type { Restaurant } from '@/modules/types'
import { Calendar, Eye, MapPin, Pencil, Phone, Settings, StoreIcon as Shop } from 'lucide-react'

export function RestaurantCard({
  restaurant,
  onViewDetails,
  onEdit
}: {
  restaurant: Restaurant
  onViewDetails: (r: Restaurant) => void
  onEdit?: (r: Restaurant) => void
}) {
  const created = new Date(restaurant.createdAt)
  const createdText = created.toLocaleDateString('tr-TR')

  return (
    <Card className='hover:bg-background relative transition-colors'>
      <CardHeader className='flex flex-row items-start justify-between pb-2'>
        <div className='flex items-start gap-2'>
          <Shop className='mt-0.5 h-5 w-5 shrink-0 text-amber-400' />
          <div className='min-w-0'>
            <div className='text-foreground truncate text-base font-semibold'>{restaurant.name}</div>
          </div>
        </div>
        <Badge color={restaurant.isActive ? 'success' : 'secondary'} variant='outline' className='text-xs'>
          {restaurant.isActive ? 'Aktif' : 'Pasif'}
        </Badge>
      </CardHeader>
      <CardContent className='pt-0'>
        {/* Info */}
        <div className='text-muted-foreground space-y-2 text-sm'>
          <div className='flex items-start gap-2'>
            <MapPin className='mt-0.5 h-4 w-4' />
            <div className='truncate'>{restaurant.address}</div>
          </div>
          <div className='flex items-center gap-2'>
            <Phone className='h-4 w-4' />
            <div>{restaurant.phone}</div>
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <Calendar className='h-4 w-4' />
            <div>Kayıt: {createdText}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='border-default-200 mt-3 border-t px-0 pt-3'>
        <div className='flex w-full flex-col gap-2'>
          <div className='flex items-center justify-between gap-2 px-4'>
            {/* hizmet içi, hizmet dışı */}
            {restaurant.isActive ? (
              <Badge color='success' variant='outline' className='text-xs'>
                Hizmet Veriyor
              </Badge>
            ) : (
              <Badge color='secondary' variant='outline' className='text-xs'>
                Hizmet Dışı
              </Badge>
            )}
            <div className='text-muted-foreground text-[11px]'>ID: {restaurant.id}</div>
          </div>
          <div className='flex w-full items-center justify-around gap-2 border-t px-4 pt-4'>
            <Button size='xs' variant='outline' onClick={() => onViewDetails(restaurant)}>
              <Eye className='mr-1 h-3.5 w-3.5' />
              Detay
            </Button>
            <Button
              size='xs'
              variant='outline'
              color='secondary'
              disabled={!onEdit}
              onClick={() => onEdit?.(restaurant)}
            >
              <Pencil className='mr-1 h-3.5 w-3.5' />
              Düzenle
            </Button>
            <Button size='xs' variant='outline' color='secondary' disabled>
              <Settings className='mr-1 h-3.5 w-3.5' />
              Ayarlar
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
