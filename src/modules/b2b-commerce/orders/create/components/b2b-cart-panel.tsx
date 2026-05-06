'use client'

import CustomImage from '@/components/image'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/formatCurrency'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, MapPin, Package, ShoppingCart } from 'lucide-react'
import type { ReactNode } from 'react'
import { getB2BUnitPrice } from '../../../utils/b2b-price'
import { MIN_B2B_ORDER_AMOUNT } from '../constants'
import { useB2BCheckout } from '../context/B2BCheckoutContext'
import { B2BCartQuantityButtons } from './b2b-cart-quantity-buttons'

interface B2BCartHeaderProps {
  compact?: boolean
  rightSlot?: ReactNode
}

export function B2BCartHeader({ compact = false, rightSlot }: B2BCartHeaderProps) {
  const { cartItemCount } = useB2BCheckout()
  return (
    <div className={cn('border-border flex items-center justify-between gap-3 border-b', compact ? 'p-3' : 'p-4')}>
      <div className='flex min-w-0 items-center gap-3'>
        <div
          className={cn(
            'bg-primary/10 text-primary flex shrink-0 items-center justify-center rounded-lg',
            compact ? 'size-8' : 'size-9'
          )}
        >
          <ShoppingCart className={compact ? 'size-4' : 'size-5'} />
        </div>
        <h2 className={cn('text-foreground truncate font-bold', compact ? 'text-base' : 'text-lg')}>Sepetim</h2>
        <span
          className={cn(
            'bg-primary/10 text-primary shrink-0 rounded-full px-2 py-0.5 font-medium',
            compact ? 'text-xs' : 'text-sm'
          )}
        >
          {cartItemCount} Ürün
        </span>
      </div>
      {rightSlot}
    </div>
  )
}

interface B2BCartItemsListProps {
  compact?: boolean
  emptyClassName?: string
  thumbClassName?: string
}

export function B2BCartItemsList({ compact = false, emptyClassName, thumbClassName }: B2BCartItemsListProps) {
  const { cart, updateQuantity } = useB2BCheckout()
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
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <AnimatePresence mode='popLayout'>
        {cart.map(item => {
          const unit = getB2BUnitPrice(item.product)
          return (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={cn(
                'bg-secondary/25 border-border/50 flex rounded-xl border shadow-sm backdrop-blur-2xl',
                compact ? 'gap-2 p-2.5' : 'gap-3 p-3'
              )}
            >
              <div
                className={
                  thumbClassName ??
                  cn(
                    'bg-background flex shrink-0 items-center justify-center rounded-lg shadow-xs',
                    compact ? 'size-11' : 'size-14 sm:size-16'
                  )
                }
              >
                {item.product.image ? (
                  <CustomImage src={item.product.image} alt={item.product.name} className='h-full object-contain' />
                ) : (
                  <Package className={cn('text-muted-foreground/30', compact ? 'size-6' : 'size-7 sm:size-8')} />
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <h4 className='text-foreground line-clamp-1 text-sm font-medium'>{item.product.name}</h4>
                <p className='text-muted-foreground text-xs'>
                  {item.product.brand.name} | {item.product.unit}
                </p>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-primary text-sm font-semibold'>{formatCurrency(unit * item.quantity)}</span>
                  <B2BCartQuantityButtons
                    quantity={item.quantity}
                    onIncrement={() => updateQuantity(item.product.id, item.quantity + 1)}
                    onDecrement={() => updateQuantity(item.product.id, item.quantity - 1)}
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

interface B2BCartCheckoutSectionProps {
  compact?: boolean
  hidePlaceOrderButton?: boolean
}

export function B2BCartCheckoutSection({ compact = false, hidePlaceOrderButton = false }: B2BCartCheckoutSectionProps) {
  const { cart, cartTotal, canOrder, selectedDeliveryAddress, openAddressDialog, isSubmitting, openOrderConfirm } =
    useB2BCheckout()

  if (cart.length === 0) return null

  const remaining = MIN_B2B_ORDER_AMOUNT - cartTotal
  const canSubmitOrder = canOrder && Boolean(selectedDeliveryAddress)
  const handlePlaceOrder = () => openOrderConfirm()

  return (
    <motion.div
      layout='position'
      className={cn('border-border bg-card border-t', compact ? 'space-y-3 p-3' : 'space-y-4 p-4')}
    >
      <div
        className={cn(
          'bg-secondary/45 border-border/50 flex items-center gap-3 rounded-xl border',
          compact ? 'p-2.5' : 'p-3'
        )}
      >
        <MapPin className={cn('text-primary shrink-0', compact ? 'size-4' : 'size-5')} />
        <div className='min-w-0 flex-1'>
          <p className='text-muted-foreground text-xs'>Teslimat Adresi</p>
          <p className='text-foreground line-clamp-2 text-xs font-medium'>
            {selectedDeliveryAddress || 'Restoran adresi bulunamadı. Lütfen farklı bir adres seçiniz.'}
          </p>
        </div>
        <Button type='button' variant='outline' size='xs' className='shrink-0' onClick={openAddressDialog}>
          Farklı Adres
        </Button>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-foreground font-semibold'>Toplam</span>
        <span className={cn('text-primary font-bold', compact ? 'text-lg' : 'text-xl')}>
          {formatCurrency(cartTotal)}
        </span>
      </div>

      {MIN_B2B_ORDER_AMOUNT > cartTotal && (
        <div className='flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3'>
          <AlertCircle className='size-4 shrink-0 text-amber-600' />
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='text-xs text-amber-800'
          >
            Minimum {formatCurrency(MIN_B2B_ORDER_AMOUNT)} tutarına {formatCurrency(remaining)} kaldı
          </motion.p>
        </div>
      )}

      {!hidePlaceOrderButton && (
        <Button
          size={compact ? 'default' : 'lg'}
          className='w-full gap-2 shadow-sm'
          disabled={isSubmitting || !canSubmitOrder}
          onClick={handlePlaceOrder}
        >
          <Check className={compact ? 'size-4' : 'size-5'} />
          Sepeti Onayla
        </Button>
      )}
    </motion.div>
  )
}
