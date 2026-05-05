'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogContentInner, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { AlertCircle, CheckCircle2, CreditCard, Package } from 'lucide-react'

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
      <DialogContent size='3xl'>
        <DialogHeader>
          <DialogTitle>Sipariş Detayı</DialogTitle>
        </DialogHeader>

        <DialogContentInner className='space-y-4 pb-4'>
          {isLoading || !detail ? (
            <B2BOrderDetailSkeleton />
          ) : (
            <>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Card className='border-border/70'>
                  <CardContent className='space-y-2 pt-4 text-sm'>
                    <p>
                      <span className='text-muted-foreground'>Sipariş No:</span> {detail.id}
                    </p>
                    <p>
                      <span className='text-muted-foreground'>Sipariş Tarihi:</span>{' '}
                      {formatDateTR(detail.orderDate, true)}
                    </p>
                    <p className='flex items-center gap-1'>
                      <span className='text-muted-foreground'>Ödeme Durumu:</span>
                      {detail.isPaymentReceived ? 'Alındı' : 'Alınmadı'}
                      {detail.isPaymentReceived ? (
                        <CheckCircle2 className='size-4 text-green-600' />
                      ) : (
                        <AlertCircle className='size-4 text-amber-600' />
                      )}
                    </p>
                    <p>
                      <span className='text-muted-foreground'>Toplam:</span> {formatCurrency(detail.totalAmount)}
                    </p>
                  </CardContent>
                </Card>
                <Card className='border-border/70'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <CreditCard className='text-primary size-4' />
                      Ödeme Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-1 text-sm'>
                    {isLoadingPaymentInformation ? (
                      <B2BPaymentBlockSkeleton />
                    ) : (
                      <>
                        <p>
                          <span className='font-medium'>IBAN:</span> {paymentInformation?.iban}
                        </p>
                        <p>
                          <span className='font-medium'>Hesap Adı:</span> {paymentInformation?.accountName}
                        </p>
                        <p>
                          <span className='font-medium'>Açıklama:</span> {paymentInformation?.description}
                        </p>
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
