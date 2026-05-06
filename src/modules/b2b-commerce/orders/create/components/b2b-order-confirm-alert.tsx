'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useB2BCheckout } from '../context/B2BCheckoutContext'
import { B2BCartCheckoutSection, B2BCartHeader, B2BCartItemsList } from './b2b-cart-panel'

export function B2BOrderConfirmAlert() {
  const { isOrderConfirmOpen, closeOrderConfirm, canOrder, isSubmitting, submitOrder } = useB2BCheckout()

  return (
    <AlertDialog open={isOrderConfirmOpen} onOpenChange={open => !open && closeOrderConfirm()}>
      <AlertDialogContent size='2xl' className='overflow-hidden'>
        <AlertDialogHeader className='pr-10'>
          <AlertDialogTitle>Siparişi Onayla</AlertDialogTitle>
          <AlertDialogDescription>
            Sepetini ve teslimat adresini kontrol ederek siparişi tamamlayabilirsin.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='border-border/70 mx-2 overflow-hidden rounded-xl border sm:mx-4'>
          <B2BCartHeader compact />
          <div className='max-h-[42vh] overflow-y-auto p-3'>
            <B2BCartItemsList compact />
          </div>
          <B2BCartCheckoutSection compact hidePlaceOrderButton />
        </div>

        <AlertDialogFooter className='flex flex-row'>
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
            asChild
          >
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
