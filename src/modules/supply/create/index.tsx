'use client'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FilterCard, SearchInput, SortSelect, StatusSelect, type FilterOption } from '@/components/ui/filter-card'
import { useFilter } from '@/hooks/use-filter'
import { cn } from '@/lib/utils'
import { Package, Search, ShoppingCart } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SupplyCartSheet } from './components/supply-cart-sheet'
import { SupplyGridDensityToolbar } from './components/supply-grid-density-toolbar'
import { SupplyOrderResultDialog } from './components/supply-order-result-dialog'
import { SupplyProductCard } from './components/supply-product-card'
import { MIN_SUPPLY_ORDER_AMOUNT } from './constants'
import { useCreateSupplyOrderMutation } from './hooks/useCreateSupplyOrderMutation'
import { useSupplyBrandsQuery } from './hooks/useSupplyBrandsQuery'
import { useSupplyCart } from './hooks/useSupplyCart'
import { useSupplyCategoriesQuery } from './hooks/useSupplyCategoriesQuery'
import { useSupplyGridDensity } from './hooks/useSupplyGridDensity'
import {
  defaultSupplyProductsFilters,
  useSupplyProductsListQuery,
  type SupplyProductsFilters
} from './hooks/useSupplyProductsListQuery'
import { getSupplyUnitPrice } from './utils/supply-price'

const sortByOptions: FilterOption[] = [
  { value: 'name', label: 'Ürün Adı' },
  { value: 'price', label: 'Fiyat' }
]

export default function SupplyOrdersCreateView() {
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false)
  const [orderResult, setOrderResult] = useState<{ orderId: string; message: string } | null>(null)

  const { cart, addToCart, updateQuantity, getCartQuantity, cartItemCount, clearCart } = useSupplyCart()
  const { gridClassName, options, columnCount, selectCols } = useSupplyGridDensity()

  const {
    data: products,
    total: totalProducts,
    isFetching,
    filters,
    sorting,
    setSorting,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange
  } = useSupplyProductsListQuery()

  const {
    pendingFilters,
    hasActiveFilters,
    hasPendingChanges,
    handleApplyFilters,
    handleClearFilters,
    updatePendingFilters
  } = useFilter<SupplyProductsFilters>(
    filters,
    handleFiltersChange,
    () => handleFiltersChange(defaultSupplyProductsFilters),
    defaultSupplyProductsFilters
  )

  const { data: categories = [] } = useSupplyCategoriesQuery()
  const { data: brands = [] } = useSupplyBrandsQuery(pendingFilters.categoryId)

  const createSupplyOrderMutation = useCreateSupplyOrderMutation()

  const categoryOptions = useMemo<FilterOption[]>(
    () => [
      { value: 'all', label: 'Tüm Kategoriler' },
      ...categories.map(category => ({ value: category.id, label: category.name }))
    ],
    [categories]
  )

  const brandOptions = useMemo<FilterOption[]>(
    () => [{ value: 'all', label: 'Tüm Markalar' }, ...brands.map(brand => ({ value: brand.id, label: brand.name }))],
    [brands]
  )

  const shouldShowBrandSelect = brands.length > 1

  useEffect(() => {
    if (!shouldShowBrandSelect && pendingFilters.brandId !== 'all') {
      updatePendingFilters({ brandId: 'all' })
      return
    }

    if (pendingFilters.brandId !== 'all' && !brandOptions.some(option => option.value === pendingFilters.brandId)) {
      updatePendingFilters({ brandId: 'all' })
    }
  }, [brandOptions, pendingFilters.brandId, shouldShowBrandSelect, updatePendingFilters])

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + getSupplyUnitPrice(item.product) * item.quantity, 0),
    [cart]
  )

  const canOrder = cartTotal >= MIN_SUPPLY_ORDER_AMOUNT

  const handlePlaceOrder = async () => {
    if (!canOrder || cart.length === 0 || createSupplyOrderMutation.isPending) return

    try {
      const result = await createSupplyOrderMutation.mutateAsync({
        items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity }))
      })

      clearCart()
      setIsCartSheetOpen(false)
      setOrderResult(result)
    } catch {
      // Mock akışında hata beklenmiyor; üretim entegrasyonunda global hata middleware'i devreye girer.
    }
  }

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Tedarik ürünleri ({totalProducts})</CardTitle>
          <div className='flex flex-row items-center gap-2'>
            <Button variant='outline' size='xs' className='relative gap-2' onClick={() => setIsCartSheetOpen(true)}>
              <ShoppingCart className='size-4' />
              <span>Sepet</span>
              {cartItemCount > 0 && (
                <span className='bg-primary text-primary-foreground absolute -top-2 -right-2 flex min-w-5 items-center justify-center rounded-full px-1 text-sm font-medium'>
                  {cartItemCount}
                </span>
              )}
            </Button>
            <SupplyGridDensityToolbar options={options} columnCount={columnCount} onSelectCols={selectCols} />
          </div>
        </CardHeader>

        <CardContent className='flex flex-col gap-4'>
          <FilterCard
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            onApply={handleApplyFilters}
            hasActiveFilters={hasActiveFilters}
            hasPendingChanges={hasPendingChanges}
          >
            <SearchInput
              className='min-w-[200px]'
              placeholder='Ürün veya marka ara...'
              value={pendingFilters.search}
              onChange={value => updatePendingFilters({ search: value ?? '' })}
              Icon={Search}
              defaultValue=''
            />

            <StatusSelect
              options={categoryOptions}
              value={pendingFilters.categoryId}
              onChange={value => updatePendingFilters({ categoryId: value, brandId: 'all' })}
              placeholder='Kategori seçin'
            />

            {shouldShowBrandSelect && (
              <StatusSelect
                options={brandOptions}
                value={pendingFilters.brandId}
                onChange={value => updatePendingFilters({ brandId: value })}
                placeholder='Marka seçin'
              />
            )}

            <SortSelect
              sortByOptions={sortByOptions}
              sorting={sorting}
              onSortingChange={setSorting}
              placeholder='Sıralama'
            />
          </FilterCard>

          <div className={cn('grid gap-4', gridClassName)}>
            {products.map((product, index) => {
              const cartQty = getCartQuantity(product.id)
              return (
                <SupplyProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  cartQty={cartQty}
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
              <p className='text-muted-foreground'>Ürün bulunamadı</p>
            </div>
          )}

          <Pagination
            page={pagination.page}
            pageSize={pagination.limit}
            total={totalProducts}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <SupplyCartSheet
        open={isCartSheetOpen}
        onOpenChange={setIsCartSheetOpen}
        cart={cart}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        minOrderAmount={MIN_SUPPLY_ORDER_AMOUNT}
        canOrder={canOrder}
        onUpdateQuantity={updateQuantity}
        onPlaceOrder={handlePlaceOrder}
        isSubmitting={createSupplyOrderMutation.isPending}
      />

      <SupplyOrderResultDialog
        open={Boolean(orderResult)}
        orderId={orderResult?.orderId}
        message={orderResult?.message}
        onOpenChange={open => {
          if (!open) setOrderResult(null)
        }}
      />
    </>
  )
}
