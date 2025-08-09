'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Restaurant } from '@/modules/orders/types'
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
      <CardContent className='p-4'>
        <div className='absolute top-3 right-3'>
          <Badge color={restaurant.isActive ? 'success' : 'secondary'} variant='outline' className='text-xs'>
            {restaurant.isActive ? 'Aktif' : 'Pasif'}
          </Badge>
        </div>

        {/* Header */}
        <div className='mb-3 flex items-start gap-2'>
          <Shop className='mt-0.5 h-5 w-5 shrink-0 text-amber-400' />
          <div className='min-w-0'>
            <div className='text-foreground truncate text-base font-semibold'>{restaurant.name}</div>
          </div>
        </div>

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

        {/* Footer */}
        <div className='border-default-200 mt-3 flex items-center justify-between border-t pt-3'>
          <div className='text-muted-foreground text-[11px]'>ID: {restaurant.id}</div>
          <div className='flex items-center gap-2'>
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
      </CardContent>
    </Card>
  )
}
