'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/formatCurrency'
import type { Order } from '@/modules/types'
import { ArrowLeft, Package, User } from 'lucide-react'
import dynamic from 'next/dynamic'
import { startTransition, useEffect, useState } from 'react'
import { formatDateTR } from '../../utils'
import { ChannelBadge, PaymentMethodBadge, StatusBadge } from '../Badges'
import CourierCard from '../courier/CourierCard'

const CourierMap = dynamic(() => import('../courier/CourierMap'), { ssr: false })

interface OrderDetailDialogProps {
  order: Order | null
  open: boolean
  onClose: () => void
}

export function OrderDetailDialog({ order, open, onClose }: OrderDetailDialogProps) {
  const [openMap, setOpenMap] = useState(false)

  const handleToggleMap = () => setOpenMap(prev => !prev)

  // Reset openMap when dialog closes
  useEffect(() => {
    if (open) return
    startTransition(() => setOpenMap(false))
  }, [open])

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size='4xl' className='max-h-[90vh] p-1'>
        <DialogHeader className='p-6 pb-4'>
          <DialogTitle className='flex flex-wrap items-center gap-3'>
            {openMap ? (
              <div className='flex items-center gap-2'>
                <span>Kurye Haritası</span>
                <Button size='xs' color='secondary' variant='outline' onClick={handleToggleMap}>
                  <ArrowLeft className='mr-1 h-4 w-4' /> Geri Dön
                </Button>
              </div>
            ) : (
              <>
                <span>Sipariş Detayı</span>
                <StatusBadge status={order.status} variant='soft' />
                <span className='text-muted-foreground text-sm font-normal'>#{order.id}</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {openMap && order.courierInfo ? (
          <div className='flex h-104 w-full p-4 pt-0'>
            <CourierMap
              courierInfo={order.courierInfo!}
              courierPosition={order.courierInfo.position}
              customerPosition={order.customerPosition}
              key={order.courierInfo.id}
            />
          </div>
        ) : (
          <ScrollArea className='max-h-[calc(90vh-120px)] p-6 pt-0'>
            {/* Kurye Bilgileri */}
            {order.courierInfo && <CourierCard courierInfo={order.courierInfo} handleToggleMap={handleToggleMap} />}

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Sipariş Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Package className='h-4 w-4' />
                    Sipariş Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Sipariş ID</span>
                    <span className='font-mono text-sm'>{order.id}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Durum</span>
                    <StatusBadge status={order.status} variant='soft' />
                  </div>
                  <Separator />
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Ödeme Yöntemi</span>
                    <PaymentMethodBadge paymentMethod={order.paymentMethod} />
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Kanal</span>
                    <ChannelBadge channel={order.channel} />
                  </div>
                  <Separator />
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground flex items-center gap-1 text-sm'>Oluşturulma</span>
                    <span className='text-sm'>{formatDateTR(order.createdAt)}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground flex items-center gap-1 text-sm'>Son Güncelleme</span>
                    <span className='text-sm'>{formatDateTR(order.updatedAt)}</span>
                  </div>
                  <Separator />
                  <div className='bg-muted/50 flex items-center justify-between rounded-lg p-3'>
                    <span className='text-sm font-medium'>Toplam Tutar</span>
                    <span className='text-warning text-xl font-bold'>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Müşteri Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <User className='h-4 w-4' />
                    Müşteri Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Ad Soyad</span>
                    <span className='text-sm'>{order.customerName}</span>
                  </div>

                  <Separator />

                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Telefon</span>
                    <a href={`tel:${order.customerPhone}`} className='text-sm'>
                      {order.customerPhone}
                    </a>
                  </div>

                  <Separator />

                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm text-nowrap'>Teslimat Adresi</span>
                    <div className='pl-6 text-right text-sm leading-relaxed'>
                      {order.customerAddress}
                      <div className='text-muted-foreground mt-2 font-mono text-xs'>
                        ({order.customerPosition[0].toFixed(6)}, {order.customerPosition[1].toFixed(6)})
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
