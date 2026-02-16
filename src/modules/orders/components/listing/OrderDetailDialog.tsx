'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogContentInner, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MaskedText } from '@/components/ui/masked-text'
import { Separator } from '@/components/ui/separator'
import { formatCurrencyTRY } from '@/lib/utils/currency'
import { maskAddress, maskLastName, maskPhone } from '@/lib/utils/mask'
import { OrderStatusesGroups } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ExternalLink, Package, User } from 'lucide-react'
import dynamic from 'next/dynamic'
import { startTransition, useEffect, useState } from 'react'
import { ordersService } from '../../service/order.service'

import MapLoading from '@/components/map-loaging'
import { TooltippedElement } from '@/components/tooltipped-element'
import { formatDateDifferentString } from '@/lib/utils/date'
import { ACTIVE_ORDER_STATUS_GROUPS } from '../../constants'
import { ChannelBadge, OrderStatusBadge, PaymentMethodBadge } from '../Badges'
import CourierCard from '../courier/CourierCard'
import { OrderDetailSkeleton } from './OrderDetailSkeleton'
import { OrderTimeLine } from './OrderTimeLine'

const CourierMap = dynamic(() => import('../courier/CourierMap').then(mod => mod.default), {
  ssr: false,
  loading: () => <MapLoading />
})

interface OrderDetailDialogProps {
  orderId?: string
  onClose: () => void
}

export function OrderDetailDialog({ orderId, onClose }: OrderDetailDialogProps) {
  const [openMap, setOpenMap] = useState(false)
  const [open, setOpen] = useState(false)

  const { data: order, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: () => ordersService.getOrderById(orderId!),
    staleTime: 0,
    enabled: Boolean(orderId)
  })

  useEffect(() => {
    setOpen(Boolean(orderId))
  }, [orderId])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const handleToggleMap = () => setOpenMap(prev => !prev)

  useEffect(() => {
    if (open) return
    startTransition(() => setOpenMap(false))
  }, [open])

  const isOrderInProgress = order && ACTIVE_ORDER_STATUS_GROUPS.includes(order.status)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size='4xl'>
        <DialogHeader>
          <DialogTitle>
            {openMap ? (
              <div className='-mb-2 flex w-full items-center justify-between gap-2 pr-10 pl-4'>
                <span>Kurye Haritası</span>
                <Button size='xs' variant='outline' onClick={handleToggleMap}>
                  <ArrowLeft className='mr-1 size-4' /> Geri Dön
                </Button>
              </div>
            ) : (
              <span>Sipariş Detayları</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <DialogContentInner className='mb-2 sm:mb-4'>
          {isLoadingDetail ? (
            <OrderDetailSkeleton />
          ) : (
            <>
              {openMap && order?.courierInfo ? (
                <div className='flex h-104 w-full p-4 pt-0'>
                  <CourierMap
                    orderId={order.orderId}
                    orderSId={order.sId}
                    courierInfo={order.courierInfo}
                    courierPosition={order.courierInfo.position}
                    customerPosition={order.customerPosition}
                    key={order.courierInfo.id}
                    customerName={order.customerName}
                  />
                </div>
              ) : (
                <div className='overflow-y-auto'>
                  {/* Kurye Bilgileri */}
                  {order?.courierInfo && (
                    <CourierCard
                      courierInfo={order.courierInfo}
                      handleToggleMap={handleToggleMap}
                      isShipped={order.status === OrderStatusesGroups.SHIPPED}
                    />
                  )}

                  <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
                          <span className='text-sm max-sm:ml-2 max-sm:text-xs'>{order?.orderId}</span>
                        </div>
                        <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                          <span className='text-muted-foreground text-sm'>Durum</span>
                          {order && <OrderStatusBadge className='max-sm:ml-2' status={order.status} variant='soft' />}
                        </div>
                        <Separator />
                        <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                          <span className='text-muted-foreground text-sm'>Ödeme Yöntemi</span>
                          {order && (
                            <PaymentMethodBadge
                              className='w-full text-right max-sm:ml-2'
                              paymentMethod={order.paymentType}
                              showIcon
                              IsPrepaid={order.isPrepaid}
                            />
                          )}
                        </div>
                        <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                          <span className='text-muted-foreground text-sm'>Kanal</span>
                          {order && <ChannelBadge className='max-sm:ml-2' showText channel={order.channel} />}
                        </div>
                        <Separator />
                        <OrderTimeLine order={order} />

                        {!isOrderInProgress && order && (
                          <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                            <span className='text-muted-foreground text-sm'>Tamamlanma Süresi</span>
                            <span className='text-sm max-sm:ml-2 max-sm:text-xs'>
                              {formatDateDifferentString(order.createdAt, order.updatedAt)}
                            </span>
                          </div>
                        )}
                        <Separator />
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground flex items-center gap-1 text-sm'>Toplam Tutar</span>
                          <span className='text-primary-700 text-xl font-bold'>
                            {order && formatCurrencyTRY(order.totalAmount)}
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
                        <div className='flex items-center justify-between gap-2'>
                          <span className='text-muted-foreground text-sm'>Ad Soyad</span>
                          {order && (
                            <MaskedText
                              value={order.customerName}
                              maskFn={maskLastName}
                              defaultMasked={true}
                              textClassName='text-sm'
                              className='text-right'
                            />
                          )}
                        </div>

                        <Separator />

                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground text-sm'>Telefon</span>
                          {order?.customerPhone && (
                            <MaskedText
                              value={order.customerPhone}
                              maskFn={maskPhone}
                              defaultMasked={true}
                              asLink={true}
                              href={`tel:${order.customerPhone}`}
                              textClassName='text-sm'
                              className='text-right'
                            />
                          )}
                        </div>

                        <Separator />

                        {/* Müşteri Notu (Temassız Teslimat ve Zili Çalma) */}
                        {order?.customerNote && (
                          <>
                            <div className='flex items-start justify-between gap-2'>
                              <span className='text-muted-foreground text-sm text-nowrap'>Müşteri Notu</span>
                              <div className='pl-6 text-right text-sm leading-relaxed'>
                                <span className='text-gray-900'>{order.customerNote}</span>
                              </div>
                            </div>
                            <Separator />
                          </>
                        )}

                        <div className='flex items-start justify-between gap-2'>
                          <span className='text-muted-foreground text-sm text-nowrap'>Teslimat Adresi</span>
                          <div className='justify-items-end space-y-1 pl-6 text-right text-sm leading-relaxed'>
                            {order?.deliveryAddress && (
                              <MaskedText
                                className='items-start justify-end text-right'
                                maskFn={maskAddress}
                                value={order.deliveryAddress}
                              />
                            )}
                            {order?.customerPosition?.[0] != null && order?.customerPosition?.[1] != null && (
                              <TooltippedElement tooltipContent='Google Haritada Görüntüle' className='text-xs'>
                                <a
                                  className='text-muted-foreground hover:text-primary my-2 flex items-center gap-1 font-mono text-xs text-nowrap underline'
                                  href={`https://maps.google.com/?q=${order.customerPosition[0]},${order.customerPosition[1]}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  ({order.customerPosition[0].toFixed(6)}, {order.customerPosition[1].toFixed(6)})
                                  <ExternalLink className='size-3.5' />
                                </a>
                              </TooltippedElement>
                            )}
                          </div>
                        </div>

                        {/* Adres Tarifi */}
                        {order?.addressDirection && (
                          <>
                            <Separator />
                            <div className='flex items-start justify-between gap-2'>
                              <span className='text-muted-foreground text-sm text-nowrap'>Adres Tarifi</span>
                              <div className='pl-6 text-right text-sm leading-relaxed'>
                                <span className='text-gray-900'>{order.addressDirection}</span>
                              </div>
                            </div>
                          </>
                        )}
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
