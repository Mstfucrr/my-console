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
import type { B2BCartItem } from '../../../types'
import { B2BCartCheckoutSection, B2BCartHeader, B2BCartItemsList } from './b2b-cart-panel'

interface B2BOrderConfirmAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: B2BCartItem[]
  cartItemCount: number
  cartTotal: number
  canOrder: boolean
  deliveryAddress?: string
  isSubmitting?: boolean
  onUpdateQuantity: (productId: string, quantity: number) => void
  onChangeAddress: () => void
  onConfirm: () => void
}

export function B2BOrderConfirmAlert({
  open,
  onOpenChange,
  cart,
  cartItemCount,
  cartTotal,
  canOrder,
  deliveryAddress,
  isSubmitting = false,
  onUpdateQuantity,
  onChangeAddress,
  onConfirm
}: B2BOrderConfirmAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size='2xl' className='overflow-hidden'>
        <AlertDialogHeader className='pr-10'>
          <AlertDialogTitle>Siparişi Onayla</AlertDialogTitle>
          <AlertDialogDescription>
            Sepetini ve teslimat adresini kontrol ederek siparişi tamamlayabilirsin.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='border-border/70 mx-2 overflow-hidden rounded-xl border sm:mx-4'>
          <B2BCartHeader cartItemCount={cartItemCount} compact />
          <div className='max-h-[42vh] overflow-y-auto p-3'>
            <B2BCartItemsList cart={cart} onUpdateQuantity={onUpdateQuantity} compact />
          </div>
          <B2BCartCheckoutSection
            cart={cart}
            cartTotal={cartTotal}
            canOrder={canOrder}
            deliveryAddress={deliveryAddress}
            onChangeAddress={onChangeAddress}
            compact
            isSubmitting={isSubmitting}
          />
        </div>

        <AlertDialogFooter>
          <Button size='lg' className='w-full gap-2 shadow-sm' disabled={isSubmitting} onClick={onConfirm}>
            <Check className='size-5' />
            {isSubmitting ? 'Sipariş Alınıyor...' : 'Sipariş Ver'}
          </Button>
          <AlertDialogCancel variant='outline' color='secondary' disabled={isSubmitting}>
            Vazgeç
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
