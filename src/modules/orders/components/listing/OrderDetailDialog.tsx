'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogContentInner, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MaskedText } from '@/components/ui/masked-text'
import { Separator } from '@/components/ui/separator'
import { formatCurrencyTRY } from '@/lib/utils/currency'
import { formatDateTimeTR } from '@/lib/utils/date'
import { maskAddress, maskLastName, maskPhone } from '@/lib/utils/mask'
import type { Order } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Package, User } from 'lucide-react'
import dynamic from 'next/dynamic'
import { startTransition, useEffect, useState } from 'react'
import { ordersService } from '../../service'

import { ChannelBadge, OrderStatusBadge, PaymentMethodBadge } from '../Badges'
import CourierCard from '../courier/CourierCard'
import { OrderDetailSkeleton } from './OrderDetailSkeleton'

const CourierMap = dynamic(() => import('../courier/CourierMap'), { ssr: false })

interface OrderDetailDialogProps {
  order: Order | null
  onClose: () => void
}

export function OrderDetailDialog({ order, onClose }: OrderDetailDialogProps) {
  const [openMap, setOpenMap] = useState(false)
  const [open, setOpen] = useState(false)

  // Eğer order'da customerPhone veya customerAddress yoksa, detay sayfasından çek
  const needsDetailFetch = order && (!order.customerPhone || !order.customerAddress)

  const { data: orderDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['orderDetail', order?.id],
    queryFn: () => ordersService.getOrderById(order!.id),
    enabled: Boolean(needsDetailFetch && order?.id)
  })

  // Detay varsa onu kullan, yoksa mevcut order'ı kullan
  const displayOrder = orderDetail || order

  useEffect(() => {
    setOpen(Boolean(order))
  }, [order])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const handleToggleMap = () => setOpenMap(prev => !prev)

  useEffect(() => {
    if (open) return
    startTransition(() => setOpenMap(false))
  }, [open])

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size='4xl'>
        <DialogHeader>
          <DialogTitle>
            {openMap ? (
              <div className='flex items-center gap-2'>
                <span>Kurye Haritası</span>
                <Button size='xs' color='secondary' variant='outline' onClick={handleToggleMap}>
                  <ArrowLeft className='mr-1 size-4' /> Geri Dön
                </Button>
              </div>
            ) : (
              <span>Sipariş Detayı</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <DialogContentInner className='mb-2 sm:mb-4'>
          {isLoadingDetail ? (
            <OrderDetailSkeleton />
          ) : (
            <>
              {openMap && displayOrder?.courierInfo ? (
                <div className='flex h-104 w-full p-4 pt-0'>
                  <CourierMap
                    courierInfo={displayOrder.courierInfo}
                    courierPosition={displayOrder.courierInfo.position}
                    customerPosition={displayOrder.customerPosition}
                    key={displayOrder.courierInfo.id}
                  />
                </div>
              ) : (
                <div className='overflow-y-auto'>
                  {/* Kurye Bilgileri */}
                  {displayOrder?.courierInfo && (
                    <CourierCard courierInfo={displayOrder.courierInfo} handleToggleMap={handleToggleMap} />
                  )}

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
                        <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                          <span className='text-muted-foreground text-sm'>Sipariş ID</span>
                          <span className='text-sm max-sm:ml-2 max-sm:text-xs'>{displayOrder?.id}</span>
                        </div>
                        <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                          <span className='text-muted-foreground text-sm'>Durum</span>
                          {displayOrder && (
                            <OrderStatusBadge className='max-sm:ml-2' status={displayOrder.status} variant='soft' />
                          )}
                        </div>
                        <Separator />
                        <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                          <span className='text-muted-foreground text-sm'>Ödeme Yöntemi</span>
                          {displayOrder && (
                            <PaymentMethodBadge
                              className='w-full text-right max-sm:ml-2'
                              paymentMethod={displayOrder.paymentMethod}
                            />
                          )}
                        </div>
                        <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                          <span className='text-muted-foreground text-sm'>Kanal</span>
                          {displayOrder && <ChannelBadge className='max-sm:ml-2' channel={displayOrder.channel} />}
                        </div>
                        <Separator />
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground flex items-center gap-1 text-sm'>Oluşturulma</span>
                          <span className='text-sm'>{displayOrder && formatDateTimeTR(displayOrder.createdAt)}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground flex items-center gap-1 text-sm'>Son Güncelleme</span>
                          <span className='text-sm'>{displayOrder && formatDateTimeTR(displayOrder.updatedAt)}</span>
                        </div>
                        <Separator />
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground flex items-center gap-1 text-sm'>Toplam Tutar</span>
                          <span className='text-primary-700 text-xl font-bold'>
                            {displayOrder && formatCurrencyTRY(displayOrder.totalAmount)}
                          </span>
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
                          {displayOrder && (
                            <MaskedText
                              value={displayOrder.customerName}
                              maskFn={maskLastName}
                              defaultMasked={true}
                              textClassName='text-sm'
                            />
                          )}
                        </div>

                        <Separator />

                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground text-sm'>Telefon</span>
                          {displayOrder && displayOrder.customerPhone && (
                            <MaskedText
                              value={displayOrder.customerPhone}
                              maskFn={maskPhone}
                              defaultMasked={true}
                              asLink={true}
                              href={`tel:${displayOrder.customerPhone}`}
                              textClassName='text-sm'
                            />
                          )}
                        </div>

                        <Separator />

                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground text-sm text-nowrap'>Teslimat Adresi</span>
                          <div className='pl-6 text-right text-sm leading-relaxed'>
                            {displayOrder && displayOrder.customerAddress && (
                              <MaskedText
                                className='items-start justify-end'
                                maskFn={maskAddress}
                                value={displayOrder.customerAddress}
                              />
                            )}
                            {displayOrder && (
                              <div className='text-muted-foreground mt-2 font-mono text-xs'>
                                ({displayOrder.customerPosition[0].toFixed(6)},{' '}
                                {displayOrder.customerPosition[1].toFixed(6)})
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContentInner>
      </DialogContent>
    </Dialog>
  )
}
