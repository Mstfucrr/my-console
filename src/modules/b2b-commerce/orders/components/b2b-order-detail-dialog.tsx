'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogContentInner, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDateTR } from '@/lib/utils/date'
import {
  B2BOrderDetailSkeleton,
  B2BPaymentBlockSkeleton
} from '@/modules/b2b-commerce/components/b2b-commerce-loading-skeletons'
import {
  useB2BOrderDetailQuery,
  useB2BPaymentInformationQuery
} from '@/modules/b2b-commerce/orders/hooks/useB2BOrderDetailQueries'
import { CheckCircle2, MapPin, Package } from 'lucide-react'

interface B2BOrderDetailDialogProps {
  orderId?: string
  onClose: () => void
}

export function B2BOrderDetailDialog({ orderId, onClose }: B2BOrderDetailDialogProps) {
  const open = Boolean(orderId)
  const { data: detail, isLoading } = useB2BOrderDetailQuery(orderId)
  const { data: paymentInformation, isLoading: isLoadingPaymentInformation } = useB2BPaymentInformationQuery(open)

  return (
    <Dialog open={Boolean(orderId)} onOpenChange={open => !open && onClose()}>
      <DialogContent size='4xl'>
        <DialogHeader>
          <DialogTitle>Sipariş Detayı</DialogTitle>
        </DialogHeader>

        <DialogContentInner className='space-y-4 pb-4'>
          {isLoading || !detail ? (
            <B2BOrderDetailSkeleton />
          ) : (
            <>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Card className='border-border/70'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <Package className='text-primary size-4' />
                      Sipariş Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3 text-sm'>
                    <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                      <span className='text-muted-foreground'>Sipariş Tarihi</span>
                      <span className='text-foreground max-sm:ml-2 max-sm:text-xs'>
                        {formatDateTR(detail.orderDate, true)}
                      </span>
                    </div>

                    <Separator />

                    <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                      <span className='text-muted-foreground'>Ödeme Durumu</span>
                      <span className='flex items-center gap-1 max-sm:ml-2'>
                        {/* {detail.isPaymentReceived ? (
                          <Badge color='success' variant='outline' className='border-0'>
                            <CheckCircle2 className='size-3.5' />
                            Alındı
                          </Badge>
                        ) : (
                          <Badge color='warning' variant='outline' className='border-0'>
                            <AlertCircle className='size-3.5' />
                            Bekleniyor
                          </Badge>
                        )} */}
                        <Badge color='success' variant='outline' className='border-0'>
                          <CheckCircle2 className='size-3.5' />
                          Sipariş Alındı
                        </Badge>
                      </span>
                    </div>

                    <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
                      <span className='text-muted-foreground'>Ürün Sayısı</span>
                      <span className='text-foreground max-sm:ml-2'>{detail.productCount}</span>
                    </div>

                    <Separator />
                    <div className='flex items-start justify-between gap-2'>
                      <span className='text-muted-foreground text-nowrap'>Teslimat Adresi</span>
                      <span className='text-foreground max-w-[70%] text-right leading-relaxed'>
                        {detail.address || '-'}
                      </span>
                    </div>
                    <Separator />

                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Toplam Tutar</span>
                      <span className='text-primary text-xl font-bold'>{formatCurrency(detail.totalAmount)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-border/70'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <MapPin className='text-primary size-4' />
                      Ödeme Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4 text-sm'>
                    {isLoadingPaymentInformation ? (
                      <B2BPaymentBlockSkeleton />
                    ) : (
                      <>
                        <div className='flex items-start justify-between gap-2'>
                          <span className='text-muted-foreground text-nowrap'>IBAN</span>
                          <span className='text-foreground max-w-[70%] text-right break-all'>
                            {paymentInformation?.iban || '-'}
                          </span>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='text-muted-foreground text-nowrap'>Hesap Adı</span>
                          <span className='text-foreground text-right'>{paymentInformation?.accountName || '-'}</span>
                        </div>
                        <div className='flex items-start justify-between gap-2'>
                          <span className='text-muted-foreground text-nowrap'>Açıklama</span>
                          <span className='text-foreground max-w-[70%] text-right leading-relaxed'>
                            {paymentInformation?.description || '-'}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className='border-border/70'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Package className='text-primary size-4' />
                    Ürünler
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-sm'>
                  {detail.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className='bg-secondary/25 border-border/60 flex items-start justify-between gap-3 rounded-lg border p-3'
                    >
                      <div className='min-w-0'>
                        <p className='line-clamp-1 font-medium'>{item.productName}</p>
                        <p className='text-muted-foreground'>{item.brandName}</p>
                        <p className='text-muted-foreground text-xs'>
                          {item.quantity} x {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <p className='text-primary shrink-0 font-semibold'>{formatCurrency(item.totalPrice)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </DialogContentInner>
      </DialogContent>
    </Dialog>
  )
}
