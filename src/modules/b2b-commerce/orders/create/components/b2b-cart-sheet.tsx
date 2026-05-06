'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { B2BCartItem } from '../../../types'
import { B2BCartCheckoutSection, B2BCartHeader, B2BCartItemsList } from './b2b-cart-panel'

interface B2BCartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: B2BCartItem[]
  cartItemCount: number
  cartTotal: number
  canOrder: boolean
  deliveryAddress?: string
  onChangeAddress?: () => void
  isSubmitting?: boolean
  onUpdateQuantity: (productId: string, quantity: number) => void
  onPlaceOrder?: () => void
}

export function B2BCartSheet({
  open,
  onOpenChange,
  cart,
  cartItemCount,
  cartTotal,
  canOrder,
  deliveryAddress,
  onChangeAddress,
  onUpdateQuantity,
  isSubmitting = false,
  onPlaceOrder
}: B2BCartSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='flex h-full w-full max-w-md flex-col gap-0 overflow-hidden p-0 sm:max-w-md'
        onClose={() => onOpenChange(false)}
      >
        <SheetHeader className='sr-only'>
          <SheetTitle>Sepet</SheetTitle>
        </SheetHeader>
        <B2BCartHeader cartItemCount={cartItemCount} />
        <div className='min-h-0 flex-1 overflow-y-auto p-4'>
          <B2BCartItemsList cart={cart} onUpdateQuantity={onUpdateQuantity} emptyClassName='py-16 text-center' />
        </div>
        <div className='shrink-0'>
          <B2BCartCheckoutSection
            cart={cart}
            cartTotal={cartTotal}
            canOrder={canOrder}
            deliveryAddress={deliveryAddress}
            onChangeAddress={onChangeAddress}
            isSubmitting={isSubmitting}
            onPlaceOrder={onPlaceOrder}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
