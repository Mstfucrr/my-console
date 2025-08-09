import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Order } from '@/modules/orders/types'
import { CarFrontIcon, MapPin, Phone, Store, User } from 'lucide-react'
import { formatCurrencyTRY, formatDateTR } from '../utils'
import { InfoRow } from './InfoRow'
import { OrderItemRow } from './OrderItemRow'
import { OrderLogs } from './OrderLogs'
import { StatusBadge } from './StatusBadge'

export function OrderDetailDialog({
  order,
  open,
  onClose
}: {
  order: Order | null
  open: boolean
  onClose: () => void
}) {
  const showCourierTracking = !!(order && order.status === 'on_way' && order.courierLocation)

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent size='4xl' className='p-1'>
        <DialogHeader className='p-6'>
          <DialogTitle>Sipariş Detayı</DialogTitle>
          <DialogDescription>{order?.id}</DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[70vh] p-6'>
          {order && (
            <div className='space-y-4'>
              {showCourierTracking && (
                <div className='border-info bg-info/10 text-info flex items-start justify-between gap-3 rounded-md border p-3'>
                  <div className='flex items-start gap-2'>
                    <CarFrontIcon className='mt-0.5 size-6' />
                    <div>
                      <div className='text-sm font-medium'>Kurye Takibi Aktif</div>
                      <div className='text-muted-foreground text-xs'>
                        Sipariş şu anda kurye ile müşteriye doğru yola çıktı.
                      </div>
                      <div className='text-muted-foreground mt-1 text-xs'>
                        Son konum güncellemesi: {formatDateTR(order.courierLocation!.lastUpdated)}
                      </div>
                    </div>
                  </div>
                  <Button size='xs' color='info' variant='outline' disabled>
                    Haritada Görüntüle (Yakında)
                  </Button>
                </div>
              )}

              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <div className='space-y-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Sipariş Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                      <InfoRow label='Sipariş ID' value={order.id} />
                      <InfoRow label='Durum' value={<StatusBadge status={order.status} />} />
                      <InfoRow label='Oluşturulma' value={formatDateTR(order.createdAt)} />
                      <InfoRow label='Son Güncelleme' value={formatDateTR(order.updatedAt)} />
                      <InfoRow
                        label='Toplam Tutar'
                        value={<div className='text-amber-500'>{formatCurrencyTRY(order.totalAmount)}</div>}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Müşteri Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                      <div className='flex items-center gap-2'>
                        <User className='text-muted-foreground h-4 w-4' />
                        <div className='font-medium'>{order.customerName}</div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Phone className='text-muted-foreground h-4 w-4' />
                        <div>{order.customerPhone}</div>
                      </div>
                      <div className='flex items-start gap-2'>
                        <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                        <div className='text-muted-foreground'>{order.customerAddress}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Restoran Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                      <div className='flex items-center gap-2'>
                        <Store className='text-muted-foreground h-4 w-4' />
                        <div className='font-medium'>{order.restaurant.name}</div>
                      </div>
                      <div className='flex items-start gap-2'>
                        <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                        <div className='text-muted-foreground'>{order.restaurant.address}</div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Phone className='text-muted-foreground h-4 w-4' />
                        <div className='text-muted-foreground'>{order.restaurant.phone}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className='space-y-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Sipariş Ürünleri</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                      <div className='max-h-56 space-y-2 overflow-y-auto pr-1'>
                        {order.items.map(item => (
                          <OrderItemRow
                            key={item.id}
                            name={item.name}
                            quantity={item.quantity}
                            price={item.price}
                            notes={item.notes}
                          />
                        ))}
                      </div>
                      <div className='border-default-200 my-2 border-t' />
                      <div className='flex items-center justify-between'>
                        <div className='font-semibold'>Toplam:</div>
                        <div className='text-base font-semibold text-amber-500'>
                          {formatCurrencyTRY(order.totalAmount)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Sipariş Geçmişi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <OrderLogs logs={order.logs} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
