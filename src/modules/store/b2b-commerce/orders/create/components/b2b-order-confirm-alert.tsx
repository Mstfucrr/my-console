'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useB2BCheckout } from '../context/B2BCheckoutContext'
import { B2BCartCheckoutSection, B2BCartHeader, B2BCartItemsList } from './b2b-cart-panel'

export function B2BOrderConfirmAlert() {
  const { isOrderConfirmOpen, closeOrderConfirm, canOrder, isSubmitting, submitOrder } = useB2BCheckout()

  return (
    <Dialog open={isOrderConfirmOpen} onOpenChange={open => !open && closeOrderConfirm()}>
      <DialogContent size='2xl' className='overflow-hidden'>
        <DialogHeader className='pr-10'>
          <DialogTitle>Siparişi Onayla</DialogTitle>
          <DialogDescription>
            Sepetini ve teslimat adresini kontrol ederek siparişi tamamlayabilirsin.
          </DialogDescription>
        </DialogHeader>

        <div className='border-border/70 mx-2 overflow-hidden rounded-xl border sm:mx-4'>
          <B2BCartHeader compact />
          <div className='max-h-[42vh] overflow-y-auto p-3'>
            <B2BCartItemsList compact />
          </div>
          <B2BCartCheckoutSection compact hidePlaceOrderButton />
        </div>

        <DialogFooter className='flex flex-row'>
          <Button size='sm' className='w-full gap-2 shadow-sm' disabled={!canOrder} onClick={submitOrder}>
            <Check className='size-5' />
            {isSubmitting ? 'Sipariş Alınıyor...' : 'Sipariş Ver'}
          </Button>
          <Button
            size='sm'
            className='w-auto gap-2 shadow-sm'
            variant='outline'
            color='secondary'
            disabled={isSubmitting}
            onClick={closeOrderConfirm}
          >
            Vazgeç
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
