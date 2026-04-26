'use client'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/filter-card'
import { cn } from '@/lib/utils'
import { PaginationOptions } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Package, Search, ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SupplyCartCheckoutSection, SupplyCartHeader, SupplyCartItemsList } from './components/supply-cart-panel'
import { SupplyCartSheet } from './components/supply-cart-sheet'
import { SupplyGridDensityToolbar } from './components/supply-grid-density-toolbar'
import { SupplyProductCard } from './components/supply-product-card'
import { SupplyProductDetailDialog } from './components/supply-product-detail-dialog'
import { MIN_SUPPLY_ORDER_AMOUNT } from './constants'
import { useSupplyCart } from './hooks/useSupplyCart'
import { useSupplyGridDensity } from './hooks/useSupplyGridDensity'
import { supplyService } from './service/supply.service'
import { SupplyProduct } from './types'
import { getSupplyUnitPrice } from './utils/supply-price'

export default function SupplyOrdersCreateView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 10 })
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<SupplyProduct | null>(null)

  const { cart, addToCart, updateQuantity, getCartQuantity, cartItemCount } = useSupplyCart()
  const { gridClassName, options, columnCount, selectCols } = useSupplyGridDensity()

  const { data: productsPage, isFetching } = useQuery({
    queryKey: ['supply-products', searchQuery, pagination],
    queryFn: () =>
      supplyService.listProducts({
        search: searchQuery,
        pagination
      }),
    placeholderData: keepPreviousData
  })

  const products = productsPage?.data ?? []
  const totalProducts = productsPage?.total ?? 0

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + getSupplyUnitPrice(item.product) * item.quantity, 0),
    [cart]
  )

  const canOrder = cartTotal >= MIN_SUPPLY_ORDER_AMOUNT

  return (
    <div className='bg-background min-h-screen'>
      <header className='bg-card border-border sticky top-0 z-40 border-b'>
        <div className='mx-auto max-w-[1920px] px-4 py-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <SearchInput
              className='max-w-md min-w-[200px]'
              placeholder='Urun veya marka ara...'
              value={searchQuery}
              onChange={value => {
                setSearchQuery(value ?? '')
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              Icon={Search}
              defaultValue=''
            />

            <div className='flex w-full flex-wrap items-center justify-between gap-4 sm:w-auto sm:justify-end'>
              <Button
                variant='outline'
                size='xs'
                className='relative gap-2 xl:hidden'
                onClick={() => setIsCartSheetOpen(true)}
              >
                <ShoppingCart className='size-4' />
                <span>Sepet</span>
                {cartItemCount > 0 && (
                  <span className='bg-primary text-primary-foreground absolute -top-2 -right-2 flex min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium'>
                    {cartItemCount}
                  </span>
                )}
              </Button>

              <SupplyGridDensityToolbar options={options} columnCount={columnCount} onSelectCols={selectCols} />
            </div>
          </div>
        </div>
      </header>

      <div className='mx-auto max-w-[1920px] px-4 py-6'>
        <div className='flex gap-6'>
          <div className='min-w-0 flex-1'>
            <div className={cn('grid gap-4', gridClassName)}>
              {products.map((product, index) => {
                const cartQty = getCartQuantity(product.id)
                return (
                  <SupplyProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    cartQty={cartQty}
                    onSelectProduct={setSelectedProduct}
                    onAddToCart={addToCart}
                    onIncrementQty={() => updateQuantity(product.id, cartQty + 1)}
                    onDecrementQty={() => updateQuantity(product.id, cartQty - 1)}
                  />
                )
              })}
            </div>

            {products.length === 0 && !isFetching && (
              <div className='py-16 text-center'>
                <Package className='text-muted-foreground/30 mx-auto mb-4 size-16' />
                <p className='text-muted-foreground'>Urun bulunamadi</p>
              </div>
            )}

            <Pagination
              className='mt-4'
              page={pagination.page}
              pageSize={pagination.limit}
              total={totalProducts}
              onPageChange={page => setPagination(prev => ({ ...prev, page }))}
              onPageSizeChange={limit => setPagination({ page: 1, limit })}
            />
          </div>

          <aside className='bg-card border-border sticky top-24 hidden h-max w-96 shrink-0 overflow-hidden rounded-2xl border xl:block'>
            <SupplyCartHeader cartItemCount={cartItemCount} />
            <div className='max-h-[400px] overflow-x-hidden overflow-y-auto p-4'>
              <SupplyCartItemsList cart={cart} onUpdateQuantity={updateQuantity} />
            </div>
            <SupplyCartCheckoutSection
              cart={cart}
              cartTotal={cartTotal}
              minOrderAmount={MIN_SUPPLY_ORDER_AMOUNT}
              canOrder={canOrder}
            />
          </aside>
        </div>
      </div>

      <SupplyCartSheet
        open={isCartSheetOpen}
        onOpenChange={setIsCartSheetOpen}
        cart={cart}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        minOrderAmount={MIN_SUPPLY_ORDER_AMOUNT}
        canOrder={canOrder}
        onUpdateQuantity={updateQuantity}
      />

      <SupplyProductDetailDialog
        product={selectedProduct}
        cartQty={selectedProduct ? getCartQuantity(selectedProduct.id) : 0}
        onOpenChange={open => {
          if (!open) setSelectedProduct(null)
        }}
        onAddToCart={addToCart}
        onIncrementQty={() => {
          if (selectedProduct) updateQuantity(selectedProduct.id, getCartQuantity(selectedProduct.id) + 1)
        }}
        onDecrementQty={() => {
          if (selectedProduct) updateQuantity(selectedProduct.id, getCartQuantity(selectedProduct.id) - 1)
        }}
      />
    </div>
  )
}
