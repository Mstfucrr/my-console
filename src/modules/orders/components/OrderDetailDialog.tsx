'use client'

import type React from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/formatCurrency'
import type { Order, OrderStatus } from '@/modules/types'
import { OrderStatusLabel } from '@/modules/types'
import { AlertTriangle, Car, CheckCircle, Clock, MapPin, Phone, User } from 'lucide-react'
import { formatDateTR } from '../utils'

interface OrderDetailDialogProps {
  order: Order | null
  open: boolean
  onClose: () => void
}

const getStatusColor = (status: OrderStatus) => {
  const colorMap: Record<OrderStatus, string> = {
    created: 'bg-orange-100 text-orange-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

const getTimelineIcon = (status: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    created: <Clock className='h-3 w-3' />,
    shipped: <CheckCircle className='h-3 w-3' />,
    delivered: <Car className='h-3 w-3' />,
    cancelled: <AlertTriangle className='h-3 w-3' />
  }
  return iconMap[status] || <Clock className='h-3 w-3' />
}

const getVehicleLabel = (vehicleType: string): string => {
  const vehicleMap: Record<string, string> = {
    motorcycle: 'Motosiklet',
    bicycle: 'Bisiklet',
    car: 'Araba'
  }
  return vehicleMap[vehicleType] || vehicleType
}

const getVehicleIcon = (vehicleType: string): string => {
  const iconMap: Record<string, string> = {
    motorcycle: '🏍️',
    bicycle: '🚲',
    car: '🚗'
  }
  return iconMap[vehicleType] || '🚚'
}

export function OrderDetailDialog({ order, open, onClose }: OrderDetailDialogProps) {
  if (!order) return null

  const showCourierTracking = order.status === 'shipped'
  const showCourierInfo = order.courierInfo && ['shipped', 'delivered'].includes(order.status)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size='4xl' className='p-1'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle className='flex items-center gap-3'>
            <span>Sipariş Detayı</span>
            <Badge className={getStatusColor(order.status)}>
              {OrderStatusLabel[order.status as keyof typeof OrderStatusLabel]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh] p-6 pt-0'>
          {/* Kurye Bilgileri */}
          {showCourierInfo && order.courierInfo && (
            <Card className='mb-4 border-amber-200 bg-amber-50'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Car className='h-4 w-4 text-amber-600' />
                  Kurye Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                  <div className='flex items-center gap-2'>
                    <User className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>{order.courierInfo.name}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    {order.courierInfo.licensePlate && (
                      <Badge variant='outline' className='text-xs'>
                        {order.courierInfo.licensePlate}
                      </Badge>
                    )}
                  </div>
                </div>

                {showCourierTracking && (
                  <Alert className='mt-3' variant='outline' color='info'>
                    <Car className='h-4 w-4' />
                    <AlertDescription className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>Kurye Yolda</p>
                        <p className='text-sm'>Sipariş şu anda müşteriye doğru yola çıktı.</p>
                      </div>
                      <Button size='sm' color='info' disabled>
                        Haritada Görüntüle (Yakında)
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
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
      </DialogContent>
    </Dialog>
  )
}
