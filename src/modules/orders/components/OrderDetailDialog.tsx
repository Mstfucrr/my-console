'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getStatusColor } from '@/constants'
import { formatCurrency } from '@/lib/formatCurrency'
import type { Order } from '@/modules/types'
import { OrderStatusLabel } from '@/modules/types'
import { ArrowLeft, MapPin, Phone, User } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { formatDateTR } from '../utils'
import CourierCard from './CourierCard'

const CourierMap = dynamic(() => import('./CourierMap'), { ssr: false })

interface OrderDetailDialogProps {
  order: Order | null
  open: boolean
  onClose: () => void
}

export function OrderDetailDialog({ order, open, onClose }: OrderDetailDialogProps) {
  const [openMap, setOpenMap] = useState(false)

  const handleToggleMap = () => setOpenMap(prev => !prev)

  useEffect(() => {
    if (!open) setOpenMap(false)
  }, [open])

  if (!order) return null

  const showCourierTracking = order.status === 'shipped'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size='4xl' className='p-1'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle className='flex items-center gap-3'>
            {openMap ? (
              <div className='flex items-center gap-2'>
                <span>Kurye Haritası</span>
                <Button size='xs' color='secondary' variant='outline' onClick={handleToggleMap}>
                  <ArrowLeft className='mr-1 h-4 w-4' /> Geri Dön
                </Button>
              </div>
            ) : (
              <span>Sipariş Detayı</span>
            )}
            <Badge className={getStatusColor(order.status)}>{OrderStatusLabel[order.status]}</Badge>
          </DialogTitle>
        </DialogHeader>

        {openMap && order.courierInfo ? (
          <div className='flex h-[26rem] w-full p-4 pt-0'>
            <CourierMap
              courierInfo={order.courierInfo!}
              courierPosition={order.courierInfo.position}
              customerPosition={order.customerPosition}
              key={order.courierInfo.id}
            />
          </div>
        ) : (
          <ScrollArea className='max-h-[70vh] p-6 pt-0'>
            {/* Kurye Bilgileri */}
            {order.courierInfo && (
              <CourierCard
                courierInfo={order.courierInfo}
                handleToggleMap={handleToggleMap}
                showCourierTracking={showCourierTracking}
              />
            )}

            {/* Sol Kolon - Sipariş Bilgileri */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Sipariş Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground text-sm'>Sipariş ID:</span>
                    <span className='text-sm font-medium'>{order.id}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground text-sm'>Durum:</span>
                    <Badge className={getStatusColor(order.status)}>
                      {OrderStatusLabel[order.status as keyof typeof OrderStatusLabel]}
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground text-sm'>Oluşturulma:</span>
                    <span className='text-sm'>{formatDateTR(order.createdAt)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground text-sm'>Son Güncelleme:</span>
                    <span className='text-sm'>{formatDateTR(order.updatedAt)}</span>
                  </div>
                  <Separator />
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Toplam Tutar:</span>
                    <span className='text-warning text-lg font-bold'>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Müşteri Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Müşteri Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <User className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>{order.customerName}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='text-muted-foreground h-4 w-4' />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                    <span className='text-sm'>{order.customerAddress}</span>
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
