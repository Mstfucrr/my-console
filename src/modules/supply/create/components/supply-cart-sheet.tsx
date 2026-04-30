'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { SupplyCartItem } from '../types'
import { SupplyCartCheckoutSection, SupplyCartHeader, SupplyCartItemsList } from './supply-cart-panel'

interface SupplyCartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: SupplyCartItem[]
  cartItemCount: number
  cartTotal: number
  minOrderAmount: number
  canOrder: boolean
  isSubmitting?: boolean
  onUpdateQuantity: (productId: string, quantity: number) => void
  onPlaceOrder?: () => void
}

export function SupplyCartSheet({
  open,
  onOpenChange,
  cart,
  cartItemCount,
  cartTotal,
  minOrderAmount,
  canOrder,
  onUpdateQuantity,
  isSubmitting = false,
  onPlaceOrder
}: SupplyCartSheetProps) {
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
        <SupplyCartHeader cartItemCount={cartItemCount} />
        <div className='min-h-0 flex-1 overflow-y-auto p-4'>
          <SupplyCartItemsList cart={cart} onUpdateQuantity={onUpdateQuantity} emptyClassName='py-16 text-center' />
        </div>
        <div className='shrink-0'>
          <SupplyCartCheckoutSection
            cart={cart}
            cartTotal={cartTotal}
            minOrderAmount={minOrderAmount}
            canOrder={canOrder}
            isSubmitting={isSubmitting}
            onPlaceOrder={onPlaceOrder}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
