'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogContentInner, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/formatCurrency'
import { Package, Plus, Truck } from 'lucide-react'
import type { SupplyProduct } from '../types'
import { getSupplyUnitPrice } from '../utils/supply-price'
import { SupplyCartQuantityButtons } from './supply-cart-quantity-buttons'

interface SupplyProductDetailDialogProps {
  product: SupplyProduct | null
  cartQty: number
  onOpenChange: (open: boolean) => void
  onAddToCart: (product: SupplyProduct) => void
  onIncrementQty: () => void
  onDecrementQty: () => void
}

export function SupplyProductDetailDialog({
  product,
  cartQty,
  onOpenChange,
  onAddToCart,
  onIncrementQty,
  onDecrementQty
}: SupplyProductDetailDialogProps) {
  return (
    <Dialog open={product != null} onOpenChange={onOpenChange}>
      <DialogContent size='lg' className='overflow-hidden p-0'>
        {product && (
          <>
            <div className='from-secondary to-muted relative flex h-48 items-center justify-center bg-linear-to-br'>
              <Package className='text-muted-foreground/30 size-24' />
              {product.hasDiscount && (
                <span className='absolute top-4 left-4 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white'>
                  %{product.discountPercent} Indirim
                </span>
              )}
            </div>

            <DialogHeader className='p-6 pb-0'>
              <span className='text-primary text-sm font-medium'>{product.brand.name}</span>
              <DialogTitle className='text-foreground text-left text-base font-bold'>{product.name}</DialogTitle>
            </DialogHeader>

            <DialogContentInner className='px-6 pb-6'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='bg-secondary/50 rounded-xl p-3'>
                  <p className='text-muted-foreground text-xs'>Birim</p>
                  <p className='text-foreground font-medium'>{product.unit}</p>
                </div>
                <div className='bg-secondary/50 rounded-xl p-3'>
                  <p className='text-muted-foreground text-xs'>Koli Icerigi</p>
                  <p className='text-foreground font-medium'>{product.quantityPerBox} Adet</p>
                </div>
                <div className='bg-secondary/50 rounded-xl p-3'>
                  <p className='text-muted-foreground text-xs'>Koli Agirligi</p>
                  <p className='text-foreground font-medium'>{product.boxWeight}</p>
                </div>
                <div className='bg-secondary/50 rounded-xl p-3'>
                  <p className='text-muted-foreground text-xs'>Marka</p>
                  <p className='text-foreground font-medium'>{product.brand.name}</p>
                </div>
              </div>

              {product.freeShipping && (
                <div className='mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3'>
                  <Truck className='size-5 text-green-600' />
                  <span className='text-sm font-medium text-green-800'>Ucretsiz Kargo</span>
                </div>
              )}

              <div className='mt-6 flex items-center justify-between gap-4'>
                <div>
                  {product.hasDiscount ? (
                    <div className='flex items-baseline gap-2'>
                      <span className='text-primary text-xl font-bold'>
                        {formatCurrency(getSupplyUnitPrice(product))}
                      </span>
                      <span className='text-muted-foreground text-base line-through'>
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className='text-primary text-base font-bold'>{formatCurrency(product.price)}</span>
                  )}
                </div>

                {cartQty > 0 ? (
                  <SupplyCartQuantityButtons
                    quantity={cartQty}
                    onIncrement={onIncrementQty}
                    onDecrement={onDecrementQty}
                  />
                ) : (
                  <Button size='xs' onClick={() => onAddToCart(product)} className='gap-2'>
                    <Plus className='size-4' />
                    Sepete Ekle
                  </Button>
                )}
              </div>
            </DialogContentInner>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
