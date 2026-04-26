'use client'

import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/formatCurrency'
import { motion } from 'framer-motion'
import { Package, Plus, Truck } from 'lucide-react'
import type { SupplyProduct } from '../types'
import { getSupplyUnitPrice } from '../utils/supply-price'
import { SupplyCartQuantityButtons } from './supply-cart-quantity-buttons'

interface SupplyProductCardProps {
  product: SupplyProduct
  index: number
  cartQty: number
  onSelectProduct: (product: SupplyProduct) => void
  onAddToCart: (product: SupplyProduct) => void
  onIncrementQty: () => void
  onDecrementQty: () => void
}

export function SupplyProductCard({
  product,
  index,
  cartQty,
  onSelectProduct,
  onAddToCart,
  onIncrementQty,
  onDecrementQty
}: SupplyProductCardProps) {
  const unitPrice = getSupplyUnitPrice(product)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className='bg-card border-border hover:shadow-primary/5 group overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg'
    >
      <div
        role='button'
        tabIndex={0}
        className='from-secondary to-muted relative flex h-32 cursor-pointer items-center justify-center bg-linear-to-br sm:h-40'
        onClick={() => onSelectProduct(product)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelectProduct(product)
          }
        }}
      >
        <Package className='text-muted-foreground/30 size-12 sm:size-16' />

        <div className='absolute top-2 left-2 flex flex-col gap-1'>
          {product.hasDiscount && (
            <span className='rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-medium text-white sm:text-xs'>
              %{product.discountPercent}
            </span>
          )}
          {product.freeShipping && (
            <span className='flex items-center gap-0.5 rounded-md bg-green-500 px-1.5 py-0.5 text-[10px] font-medium text-white sm:text-xs'>
              <Truck className='size-2.5 sm:size-3' />
            </span>
          )}
        </div>

        <span className='bg-card/90 text-foreground absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium sm:text-xs'>
          {product.brand.name}
        </span>
      </div>

      <div className='flex min-h-40 flex-1 flex-col justify-between p-3'>
        <div className='flex flex-col gap-1'>
          <div className='text-muted-foreground flex items-center justify-between gap-1 text-[10px] sm:text-xs'>
            <span>{product.boxWeight}</span>{' '}
            <span>
              ({product.quantityPerBox} Adet / {product.unit})
            </span>
          </div>
          <h3
            className='text-foreground hover:text-primary line-clamp-2 min-h-9 cursor-pointer text-sm font-semibold transition-colors sm:min-h-10'
            onClick={() => onSelectProduct(product)}
          >
            {product.name}
          </h3>
        </div>
        <div className='mt-auto flex w-full flex-col items-center justify-between gap-2 sm:flex-row'>
          <div>
            {product.hasDiscount ? (
              <div className='flex items-end gap-1 sm:flex-col sm:items-baseline sm:gap-0'>
                <span className='text-primary text-base font-bold'>{formatCurrency(unitPrice)}</span>
                <span className='text-muted-foreground text-xs line-through'>{formatCurrency(product.price)}</span>
              </div>
            ) : (
              <span className='text-primary text-base font-bold'>{formatCurrency(product.price)}</span>
            )}
          </div>

          {cartQty > 0 ? (
            <SupplyCartQuantityButtons quantity={cartQty} onIncrement={onIncrementQty} onDecrement={onDecrementQty} />
          ) : (
            <Button size='xs' onClick={() => onAddToCart(product)} className='gap-1'>
              <Plus className='size-3.5' />
              <span>Ekle</span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
