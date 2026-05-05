'use client'

import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/formatCurrency'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, MapPin, Package, ShoppingCart } from 'lucide-react'
import type { ReactNode } from 'react'
import type { SupplyCartItem } from '../types'
import { getSupplyUnitPrice } from '../utils/supply-price'
import { SupplyCartQuantityButtons } from './supply-cart-quantity-buttons'

interface SupplyCartHeaderProps {
  cartItemCount: number
  rightSlot?: ReactNode
}

export function SupplyCartHeader({ cartItemCount, rightSlot }: SupplyCartHeaderProps) {
  return (
    <div className='from-card to-secondary/30 border-border flex items-center justify-between gap-3 border-b bg-linear-to-r p-4'>
      <div className='flex min-w-0 items-center gap-3'>
        <div className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg'>
          <ShoppingCart className='size-5' />
        </div>
        <h2 className='text-foreground truncate text-lg font-bold'>Sepetim</h2>
        <span className='bg-primary/10 text-primary shrink-0 rounded-full px-2 py-0.5 text-sm font-medium'>
          {cartItemCount} Ürün
        </span>
      </div>
      {rightSlot}
    </div>
  )
}

interface SupplyCartItemsListProps {
  cart: SupplyCartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  emptyClassName?: string
  thumbClassName?: string
}

export function SupplyCartItemsList({
  cart,
  onUpdateQuantity,
  emptyClassName,
  thumbClassName
}: SupplyCartItemsListProps) {
  if (cart.length === 0) {
    return (
      <div className={emptyClassName ?? 'py-8 text-center'}>
        <div className='bg-secondary/40 mx-auto mb-3 flex size-12 items-center justify-center rounded-full'>
          <ShoppingCart className='text-muted-foreground/35 size-6' />
        </div>
        <p className='text-muted-foreground text-sm'>Sepetiniz boş</p>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      <AnimatePresence mode='popLayout'>
        {cart.map(item => {
          const unit = getSupplyUnitPrice(item.product)
          return (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='bg-secondary/25 border-border/50 flex gap-3 rounded-xl border p-3 shadow-sm backdrop-blur-2xl'
            >
              <div
                className={
                  thumbClassName ??
                  'bg-background flex size-14 shrink-0 items-center justify-center rounded-lg shadow-xs sm:size-16'
                }
              >
                <Package className='text-muted-foreground/30 size-7 sm:size-8' />
              </div>
              <div className='min-w-0 flex-1'>
                <h4 className='text-foreground line-clamp-1 text-sm font-medium'>{item.product.name}</h4>
                <p className='text-muted-foreground text-xs'>
                  {item.product.brand.name} | {item.product.unit}
                </p>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-primary text-sm font-semibold'>{formatCurrency(unit * item.quantity)}</span>
                  <SupplyCartQuantityButtons
                    quantity={item.quantity}
                    onIncrement={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    onDecrement={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

interface SupplyCartCheckoutSectionProps {
  cart: SupplyCartItem[]
  cartTotal: number
  minOrderAmount: number
  canOrder: boolean
  isSubmitting?: boolean
  onPlaceOrder?: () => void
}

export function SupplyCartCheckoutSection({
  cart,
  cartTotal,
  minOrderAmount,
  canOrder,
  isSubmitting = false,
  onPlaceOrder
}: SupplyCartCheckoutSectionProps) {
  if (cart.length === 0) return null

  const remaining = minOrderAmount - cartTotal

  return (
    <div className='border-border bg-card space-y-4 border-t p-4'>
      <div className='bg-secondary/45 border-border/50 flex items-center gap-3 rounded-xl border p-3'>
        <MapPin className='text-primary size-5 shrink-0' />
        <div className='min-w-0 flex-1'>
          <p className='text-muted-foreground text-xs'>Teslimat Adresi</p>
          <p className='text-foreground truncate text-sm font-medium'>Restoran Konumu</p>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-foreground font-semibold'>Toplam</span>
        <span className='text-primary text-xl font-bold'>{formatCurrency(cartTotal)}</span>
      </div>

      {!canOrder && (
        <div className='flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3'>
          <AlertCircle className='size-4 shrink-0 text-amber-600' />
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='text-xs text-amber-800'
          >
            Minimum {formatCurrency(minOrderAmount)} tutarina {formatCurrency(remaining)} kaldi
          </motion.p>
        </div>
      )}

      <Button size='lg' className='w-full gap-2 shadow-sm' disabled={!canOrder || isSubmitting} onClick={onPlaceOrder}>
        <Check className='size-5' />
        {isSubmitting ? 'Sipariş Alınıyor...' : 'Sipariş Ver'}
      </Button>
    </div>
  )
}
