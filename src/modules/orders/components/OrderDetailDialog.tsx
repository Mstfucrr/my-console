'use client'

import type React from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator
} from '@/components/ui/timeline'
import { cn } from '@/lib/utils'
import { orderStatusLabels } from '@/modules/mockData'
import type { Order } from '@/modules/types'
import { AlertTriangle, Car, CheckCircle, Clock, MapPin, Phone, Star, Store, User } from 'lucide-react'
import { formatDateTR } from '../utils'

interface OrderDetailDialogProps {
  order: Order | null
  open: boolean
  onClose: () => void
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    picked_up: 'bg-purple-100 text-purple-800',
    on_way: 'bg-red-100 text-red-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

const getTimelineIcon = (status: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    pending: <Clock className='h-3 w-3' />,
    preparing: <Clock className='h-3 w-3' />,
    ready: <CheckCircle className='h-3 w-3' />,
    picked_up: <Car className='h-3 w-3' />,
    on_way: <Car className='h-3 w-3' />,
    delivered: <CheckCircle className='h-3 w-3' />,
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const showCourierTracking = order.status === 'on_way' && order.courierLocation
  const showCourierInfo = order.courierInfo && ['picked_up', 'on_way', 'delivered'].includes(order.status)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size='4xl' className='p-1'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle className='flex items-center gap-3'>
            <span>Sipariş Detayı</span>
            <Badge className={getStatusColor(order.status)}>
              {orderStatusLabels[order.status as keyof typeof orderStatusLabels]}
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
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <User className='text-muted-foreground h-4 w-4' />
                      <span className='font-medium'>{order.courierInfo.name}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Phone className='text-muted-foreground h-4 w-4' />
                      <span>{order.courierInfo.phone}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span>{getVehicleIcon(order.courierInfo.vehicleType)}</span>
                      <span>{getVehicleLabel(order.courierInfo.vehicleType)}</span>
                      {order.courierInfo.licensePlate && (
                        <Badge variant='outline' className='text-xs'>
                          {order.courierInfo.licensePlate}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <Star className='h-4 w-4 text-amber-500' />
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < order.courierInfo!.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-muted-foreground text-sm'>({order.courierInfo.rating})</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <User className='text-muted-foreground h-4 w-4' />
                      <span className='text-muted-foreground text-sm'>
                        {order.courierInfo.totalDeliveries} teslimat
                      </span>
                    </div>
                    {order.courierInfo.currentLocation && (
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-green-600' />
                        <span className='text-muted-foreground text-xs'>
                          Son konum: {formatDateTR(order.courierInfo.currentLocation.lastUpdated)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {showCourierTracking && (
                  <Alert className='mt-3'>
                    <Car className='h-4 w-4' />
                    <AlertDescription className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>Kurye Yolda</p>
                        <p className='text-sm'>Sipariş şu anda müşteriye doğru yola çıktı.</p>
                      </div>
                      <Button size='sm' variant='outline' disabled>
                        Haritada Görüntüle (Yakında)
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Sol Kolon - Sipariş Bilgileri */}
            <div className='space-y-4'>
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
                      {orderStatusLabels[order.status as keyof typeof orderStatusLabels]}
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

              {/* Restoran Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Restoran Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Store className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>{order.restaurant.name}</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                    <span className='text-muted-foreground text-sm'>{order.restaurant.address}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='text-muted-foreground h-4 w-4' />
                    <span className='text-muted-foreground text-sm'>{order.restaurant.phone}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sağ Kolon - Ürünler ve Geçmiş */}
            <div className='space-y-4'>
              {/* Sipariş Ürünleri */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Sipariş Ürünleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='max-h-48 space-y-3 overflow-y-auto'>
                    {order.items.map(item => (
                      <div key={item.id} className='flex items-start justify-between border-b pb-3 last:border-b-0'>
                        <div className='flex-1'>
                          <span className='font-medium'>
                            {item.quantity}x {item.name}
                          </span>
                          {item.notes && <p className='text-muted-foreground mt-1 text-xs'>Not: {item.notes}</p>}
                        </div>
                        <span className='font-medium'>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className='my-3' />
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>Toplam:</span>
                    <span className='text-warning text-lg font-bold'>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Sipariş Geçmişi */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Sipariş Geçmişi</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline position='right' className='mt-4'>
                    {order.logs.map((log, logIndex) => (
                      <TimelineItem
                        key={log.timestamp}
                        className={cn(logIndex === order.logs.length - 1 ? 'pb-0' : 'pb-5')}
                      >
                        <TimelineSeparator>
                          <TimelineDot className='bg-transparent'>
                            <div className={cn('h-max rounded-full p-1', getStatusColor(log.status))}>
                              {getTimelineIcon(log.status)}
                            </div>
                          </TimelineDot>
                          {logIndex !== order.logs.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <div className='space-y-1'>
                            <p className='text-sm font-medium'>{log.message}</p>
                            <p className='text-muted-foreground text-xs'>{formatDateTR(log.timestamp)}</p>
                          </div>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
