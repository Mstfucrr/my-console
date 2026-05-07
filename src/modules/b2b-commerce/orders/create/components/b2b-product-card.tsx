'use client'

import CustomImage from '@/components/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogContentInner,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useIsMobile } from '@/hooks/use-media-query'
import { formatCurrency } from '@/lib/formatCurrency'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Package, Plus, Truck } from 'lucide-react'
import type { B2BProduct } from '../../../types'
import { getB2BUnitPrice } from '../../../utils/b2b-price'
import { useB2BCheckout } from '../context/B2BCheckoutContext'
import { B2BCartQuantityButtons } from './b2b-cart-quantity-buttons'

interface B2BProductCardProps {
  product: B2BProduct
  index: number
  columnCount: number
}

export function B2BProductCard({ product, index, columnCount }: B2BProductCardProps) {
  const { addToCart, updateQuantity, getCartQuantity } = useB2BCheckout()
  const isMobile = useIsMobile()
  const unitPrice = getB2BUnitPrice(product)
  const imageSrc = product.image?.trim() ?? ''
  const cartQty = getCartQuantity(product.id)
  const handleIncrementQty = () => updateQuantity(product.id, cartQty + 1)
  const handleDecrementQty = () => updateQuantity(product.id, cartQty - 1)

  const isMobileAndColumnCountIs1 = isMobile && columnCount === 1

  return (
    <AnimatePresence mode='popLayout'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: index * 0.02, duration: 0.25 }}
        className='h-[290px] sm:h-[325px]'
        layoutId={`product-card-${product.id}`}
      >
        <B2BProductDetailDialog
          product={product}
          unitPrice={unitPrice}
          cartQty={cartQty}
          onAddToCart={() => addToCart(product)}
          onIncrementQty={handleIncrementQty}
          onDecrementQty={handleDecrementQty}
        >
          <Card className='border-border/70 hover:border-primary/25 hover:shadow-primary/10 group h-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'>
            <CardContent className={cn('flex h-full flex-1 flex-col justify-between px-0! py-1 max-sm:pt-0!')}>
              <div className='from-secondary/70 via-muted/60 to-background relative flex h-32 items-center justify-center overflow-hidden bg-linear-to-br sm:h-40'>
                {imageSrc ? (
                  <CustomImage
                    src={imageSrc}
                    alt={product.name}
                    className='h-full w-full object-contain object-center p-2 transition-transform duration-300 group-hover:scale-[1.02]'
                  />
                ) : (
                  <div className='bg-background/70 ring-border/60 flex size-16 items-center justify-center rounded-2xl shadow-sm ring-1 transition-transform duration-300 group-hover:scale-105 sm:size-20'>
                    <Package className='text-muted-foreground/35 size-9 sm:size-11' />
                  </div>
                )}

                <div className='absolute top-2 left-2 flex flex-col gap-1'>
                  {product.hasDiscount && (
                    <span className='absolute top-0 -left-10 flex h-7 w-28 -rotate-45 items-center justify-center rounded-b-full bg-red-500 px-1.5 py-0.5 text-sm font-medium text-white'>
                      %{product.discountPercent}
                    </span>
                  )}
                  {product.freeShipping && (
                    <span className='flex items-center gap-0.5 rounded-md bg-green-500 px-1.5 py-0.5 text-sm font-medium text-white shadow-sm'>
                      <Truck className='size-4.5' />
                    </span>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-1 px-3'>
                <div className='text-muted-foreground flex flex-wrap items-start justify-between gap-1 py-0.5 text-[10px] sm:text-[11px]'>
                  <span className='bg-secondary/60 -ml-1 rounded-md px-1.5 py-0.5 text-nowrap'>
                    ({product.quantityPerBox} Adet / {product.unit})
                  </span>
                </div>
                <h3 className='text-foreground line-clamp-3 min-h-9 text-xs font-semibold sm:min-h-10'>
                  {product.name} {product.name}
                </h3>
              </div>

              <div
                className={cn(
                  'mt-auto flex w-full flex-wrap items-end justify-between gap-1 px-3 max-sm:items-center sm:gap-2',
                  isMobileAndColumnCountIs1 ? 'flex-row flex-nowrap gap-4' : 'max-sm:flex-col'
                )}
              >
                <div className='min-w-0'>
                  {product.hasDiscount ? (
                    <div className='flex items-end gap-1 sm:flex-col sm:items-baseline sm:gap-0'>
                      <span className='text-primary xs:text-base text-xs font-bold'>{formatCurrency(unitPrice)}</span>
                      <span className='text-muted-foreground text-sm line-through'>
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className='text-primary text-base font-bold'>{formatCurrency(product.price)}</span>
                  )}
                </div>

                <div className={isMobileAndColumnCountIs1 ? 'max-sm:w-auto' : 'max-sm:w-full'}>
                  {cartQty > 0 ? (
                    <div className='flex w-full items-center gap-2'>
                      <B2BCartQuantityButtons
                        quantity={cartQty}
                        onIncrement={handleIncrementQty}
                        onDecrement={handleDecrementQty}
                      />
                    </div>
                  ) : (
                    <Button
                      size='xs'
                      onClick={e => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                      className='w-full gap-1 shadow-xs'
                    >
                      <Plus className='size-4' />
                      <span>Ekle</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </B2BProductDetailDialog>
      </motion.div>
    </AnimatePresence>
  )
}

interface B2BProductDetailDialogProps {
  product: B2BProduct
  unitPrice: number
  cartQty: number
  onAddToCart: () => void
  onIncrementQty: () => void
  onDecrementQty: () => void
  children?: React.ReactNode
}

function B2BProductDetailDialog({
  product,
  unitPrice,
  cartQty,
  onAddToCart,
  onIncrementQty,
  onDecrementQty,
  children
}: B2BProductDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent size='sm'>
        <DialogHeader>
          <DialogTitle className='pr-6 text-base leading-snug'>{product.name}</DialogTitle>
        </DialogHeader>

        <DialogContentInner className='space-y-3 pb-4'>
          <div className='grid grid-cols-2 gap-2'>
            <DetailTile label='Birim' value={product.unit} />
            <DetailTile label='Koli İçeriği' value={product.quantityPerBox ? `${product.quantityPerBox} Adet` : ''} />
            <DetailTile label='Koli Ağırlığı' value={product.boxWeight} />
            <DetailTile label='Kargo' value={product.freeShipping ? 'Ücretsiz' : 'Standart'} />
            <DetailTile label='Marka' value={product.brand.name} />
          </div>

          <div className='border-border/60 flex items-end justify-between gap-3 rounded-xl border p-3'>
            <div>
              <span className='text-primary text-base font-bold'>{formatCurrency(unitPrice)}</span>
              {product.hasDiscount && (
                <p className='text-muted-foreground text-xs line-through'>{formatCurrency(product.price)}</p>
              )}
            </div>

            {cartQty > 0 ? (
              <div className='flex min-w-32 items-center gap-2'>
                <B2BCartQuantityButtons quantity={cartQty} onIncrement={onIncrementQty} onDecrement={onDecrementQty} />
              </div>
            ) : (
              <Button size='xs' onClick={onAddToCart} className='gap-1 shadow-xs'>
                <Plus className='size-4' />
                <span>Ekle</span>
              </Button>
            )}
          </div>
        </DialogContentInner>
      </DialogContent>
    </Dialog>
  )
}

function DetailTile({ label, value }: { label: string; value?: string | number }) {
  return (
    <div
      className={cn('bg-secondary/50 border-border/40 rounded-xl border p-2', {
        hidden: !value
      })}
    >
      <p className='text-muted-foreground text-[10px]'>{label}</p>
      <p className='text-xs font-medium'>{value}</p>
    </div>
  )
}
