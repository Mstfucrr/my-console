'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogContentInner, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSupplyOrderPaymentInformationQuery } from '../hooks/useSupplyOrderDetailQueries'

interface SupplyOrderResultDialogProps {
  orderId?: string
  message?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplyOrderResultDialog({ orderId, message, open, onOpenChange }: SupplyOrderResultDialogProps) {
  const { data: paymentInformation, isLoading } = useSupplyOrderPaymentInformationQuery(orderId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size='lg'>
        <DialogHeader>
          <DialogTitle>Sipariş Alındı</DialogTitle>
        </DialogHeader>

        <DialogContentInner className='space-y-4 pb-4'>
          <Card>
            <CardContent className='space-y-2 pt-4'>
              <p className='text-sm'>{message ?? 'Siparişiniz başarıyla alındı.'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='space-y-2 pt-4'>
              <h4 className='text-sm font-semibold'>Ödeme Bilgileri</h4>
              {isLoading ? (
                <p className='text-muted-foreground text-sm'>Ödeme bilgileri yükleniyor...</p>
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
