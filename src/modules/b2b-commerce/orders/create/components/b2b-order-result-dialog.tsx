'use client'

import { B2BPaymentBlockSkeleton } from '@/modules/b2b-commerce/components/b2b-commerce-loading-skeletons'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogContentInner, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useB2BPaymentInformationQuery } from '../../hooks/useB2BOrderDetailQueries'
import { CheckCircle2 } from 'lucide-react'

interface B2BOrderResultDialogProps {
  orderId?: string
  message?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function B2BOrderResultDialog({ orderId, message, open, onOpenChange }: B2BOrderResultDialogProps) {
  const { data: paymentInformation, isLoading } = useB2BPaymentInformationQuery(open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size='lg'>
        <DialogHeader>
          <DialogTitle>Sipariş Alındı</DialogTitle>
        </DialogHeader>

        <DialogContentInner className='space-y-4 pb-4'>
          <Card className='border-primary/20 bg-primary/5'>
            <CardContent className='flex items-start gap-3 pt-4'>
              <div className='bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full'>
                <CheckCircle2 className='size-5' />
              </div>
              <div className='space-y-1 text-sm'>
                {orderId ? (
                  <p>
                    <span className='text-muted-foreground'>Sipariş No:</span> {orderId}
                  </p>
                ) : null}
                <p>{message ?? 'Siparişiniz başarıyla alındı.'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className='border-border/70'>
            <CardContent className='space-y-2 pt-4'>
              <h4 className='text-sm font-semibold'>Ödeme Bilgileri</h4>
              {isLoading ? (
                <B2BPaymentBlockSkeleton />
              ) : (
                <>
                  <p className='text-sm'>
                    <span className='font-medium'>IBAN:</span> {paymentInformation?.iban}
                  </p>
                  <p className='text-sm'>
                    <span className='font-medium'>Hesap Adı:</span> {paymentInformation?.accountName}
                  </p>
                  <p className='text-sm'>
                    <span className='font-medium'>Açıklama:</span> {paymentInformation?.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </DialogContentInner>
      </DialogContent>
    </Dialog>
  )
}
