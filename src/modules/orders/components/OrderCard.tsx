import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Order } from '@/modules/types'
import { MapPin, Phone, User } from 'lucide-react'
import { formatDateTR } from '../utils'
import { StatusBadge } from './StatusBadge'

export function OrderCard({ order, onViewDetails }: { order: Order; onViewDetails: (o: Order) => void }) {
  return (
    <Card className='mb-3'>
      <CardContent className='p-4 transition-all duration-300 hover:shadow-md'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            <div className='mb-1 flex flex-wrap items-center gap-2'>
              <div className='text-foreground truncate text-sm font-medium'>{order.id}</div>
              <StatusBadge status={order.status} />
            </div>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div className='text-muted-foreground flex flex-col gap-2 py-1 text-xs'>
                <div className='text-accent-foreground flex items-center gap-1 text-sm'>
                  <User className='h-3.5 w-3.5' />
                  <span className='truncate'>{order.customerName}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Phone className='h-3.5 w-3.5' />
                  <span className='truncate'>{order.customerPhone}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <MapPin className='h-3.5 w-3.5' />
                  <span className='truncate'>{order.customerAddress}</span>
                </div>
              </div>
              <div className='flex shrink-0 flex-col items-end gap-1'>
                <div className='text-foreground text-sm font-semibold'>{order.totalAmount.toFixed(2)} ₺</div>
                <span className='text-muted-foreground text-[10px]'>{formatDateTR(order.createdAt)}</span>
                <span className='text-muted-foreground text-[10px]'>{order.restaurant.name}</span>
                <Button size='xs' variant='outline' className='mt-2' onClick={() => onViewDetails(order)}>
                  Detay
                </Button>
              </div>
            </div>
            <hr className='my-2' />
            <div className='text-muted-foreground flex items-center gap-2 text-[10px]'>
              <span>{order.items.length} ürün</span>
              <span className='truncate'>{order.items.map(i => i.name).join(', ')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
