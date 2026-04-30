'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatCurrency'
import { motion } from 'framer-motion'
import { ArrowRightIcon, Package, Plus, Truck } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import type { SupplyProduct } from '../types'
import { getSupplyUnitPrice } from '../utils/supply-price'
import { SupplyCartQuantityButtons } from './supply-cart-quantity-buttons'

interface SupplyProductCardProps {
  product: SupplyProduct
  index: number
  cartQty: number
  onAddToCart: (product: SupplyProduct) => void
  onIncrementQty: () => void
  onDecrementQty: () => void
}

const faceStyle: CSSProperties = {
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden'
}

export function SupplyProductCard({
  product,
  index,
  cartQty,
  onAddToCart,
  onIncrementQty,
  onDecrementQty
}: SupplyProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const unitPrice = getSupplyUnitPrice(product)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className='perspective-distant'
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
        className='relative h-[325px] cursor-pointer'
        role='button'
        tabIndex={0}
        onClick={() => setIsFlipped(prev => !prev)}
      >
        <div style={faceStyle} className='absolute inset-0 h-full'>
          <Card className='hover:shadow-primary/5 h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg'>
            <div className='from-secondary to-muted relative flex h-32 items-center justify-center bg-linear-to-br sm:h-40'>
              <Package className='text-muted-foreground/30 size-12 sm:size-16' />

              <div className='absolute top-2 left-2 flex flex-col gap-1'>
                {product.hasDiscount && (
                  <span className='absolute top-0 -left-10 flex h-7 w-28 -rotate-45 items-center justify-center rounded-b-full bg-red-500 px-1.5 py-0.5 text-sm font-medium text-white'>
                    %{product.discountPercent}
                  </span>
                )}
                {product.freeShipping && (
                  <span className='flex items-center gap-0.5 rounded-md bg-green-500 px-1.5 py-0.5 text-sm font-medium text-white'>
                    <Truck className='size-4.5' />
                  </span>
                )}
              </div>
            </div>

            <CardContent className='flex min-h-40 flex-1 flex-col justify-between p-3'>
              <div className='flex flex-col gap-1'>
                <div className='text-muted-foreground flex items-center justify-between gap-1 text-[10px] sm:text-xs'>
                  <span>
                    ({product.quantityPerBox} Adet / {product.unit})
                  </span>
                  <Button variant='link' size='xs' className='text-primary -mt-2 items-center gap-1 p-0'>
                    <span>Detay</span> <ArrowRightIcon className='size-3.5' />
                  </Button>
                </div>
                <h3 className='text-foreground line-clamp-2 min-h-9 text-sm font-semibold sm:min-h-10'>
                  {product.name}
                </h3>
              </div>

              <div className='mt-auto flex w-full flex-col items-end justify-between gap-2 sm:flex-row'>
                <div>
                  {product.hasDiscount ? (
                    <div className='flex items-end gap-1 sm:flex-col sm:items-baseline sm:gap-0'>
                      <span className='text-primary text-base font-bold'>{formatCurrency(unitPrice)}</span>
                      <span className='text-muted-foreground text-sm line-through'>
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
                  <Button
                    size='xs'
                    onClick={e => {
                      e.stopPropagation()
                      onAddToCart(product)
                    }}
                    className='gap-1'
                  >
                    <Plus className='size-4' />
                    <span>Ekle</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div style={{ ...faceStyle, transform: 'rotateY(180deg)' }} className='absolute inset-0 h-full'>
          <Card className='h-full rounded-2xl'>
            <CardContent className='flex h-full flex-col p-3'>
              <h3 className='text-foreground text-sm font-semibold'>{product.name}</h3>

              <div className='mt-3 grid grid-cols-2 gap-2'>
                <div className='bg-secondary/50 rounded-xl p-2'>
                  <p className='text-muted-foreground text-[10px]'>Birim</p>
                  <p className='text-xs font-medium'>{product.unit}</p>
                </div>
                <div className='bg-secondary/50 rounded-xl p-2'>
                  <p className='text-muted-foreground text-[10px]'>Koli İçeriği</p>
                  <p className='text-xs font-medium'>{product.quantityPerBox} Adet</p>
                </div>
                <div className='bg-secondary/50 rounded-xl p-2'>
                  <p className='text-muted-foreground text-[10px]'>Koli Ağırlığı</p>
                  <p className='text-xs font-medium'>{product.boxWeight}</p>
                </div>
                <div className='bg-secondary/50 rounded-xl p-2'>
                  <p className='text-muted-foreground text-[10px]'>Kargo</p>
                  <p className='text-xs font-medium'>{product.freeShipping ? 'Ücretsiz' : 'Standart'}</p>
                </div>
                <div className='bg-secondary/50 rounded-xl p-2'>
                  <p className='text-muted-foreground text-[10px]'>Marka</p>
                  <p className='text-xs font-medium'>{product.brand.name}</p>
                </div>
              </div>

              <div className='mt-auto flex items-end justify-between gap-2'>
                <div>
                  <span className='text-primary text-base font-bold'>{formatCurrency(unitPrice)}</span>
                  {product.hasDiscount && (
                    <p className='text-muted-foreground text-xs line-through'>{formatCurrency(product.price)}</p>
                  )}
                </div>

                {cartQty > 0 ? (
                  <SupplyCartQuantityButtons
                    quantity={cartQty}
                    onIncrement={onIncrementQty}
                    onDecrement={onDecrementQty}
                  />
                ) : (
                  <Button
                    size='xs'
                    onClick={e => {
                      e.stopPropagation()
                      onAddToCart(product)
                    }}
                    className='gap-1'
                  >
                    <Plus className='size-4' />
                    <span>Ekle</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  )
}
