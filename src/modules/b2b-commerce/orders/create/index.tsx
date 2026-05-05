'use client'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FilterCard, SearchInput, SortSelect, type FilterOption } from '@/components/ui/filter-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFilter } from '@/hooks/use-filter'
import { useIsDesktop } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { B2BProductGridSkeleton } from '@/modules/b2b-commerce/components/b2b-commerce-loading-skeletons'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Package, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { parseB2BFilterSelection, serializeB2BFilterSelection } from '../../utils/b2b-filter-selection'
import { getB2BUnitPrice } from '../../utils/b2b-price'
import { B2BCartCheckoutSection, B2BCartHeader, B2BCartItemsList } from './components/b2b-cart-panel'
import { B2BCartSheet } from './components/b2b-cart-sheet'
import { B2BCatalogSidebar } from './components/b2b-catalog-sidebar'
import { B2BGridDensityToolbar } from './components/b2b-grid-density-toolbar'
import { B2BOrderResultDialog } from './components/b2b-order-result-dialog'
import { B2BProductCard } from './components/b2b-product-card'
import { MIN_B2B_ORDER_AMOUNT } from './constants'
import { useB2BBrandsQuery } from './hooks/useB2BBrandsQuery'
import { useB2BCart } from './hooks/useB2BCart'
import { useB2BCategoriesQuery } from './hooks/useB2BCategoriesQuery'
import { useB2BGridDensity } from './hooks/useB2BGridDensity'
import {
  defaultB2BProductsFilters,
  useB2BProductsListQuery,
  type B2BProductsFilters
} from './hooks/useB2BProductsListQuery'
import { useCreateB2BOrderMutation } from './hooks/useCreateB2BOrderMutation'

const sortByOptions: FilterOption[] = [
  { value: 'name', label: 'Ürün Adı' },
  { value: 'price', label: 'Fiyat' }
]

export default function B2BCommerceOrderCreateView() {
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false)
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false)
  const [orderResult, setOrderResult] = useState<{ orderId: string; message: string } | null>(null)
  const isDesktop = useIsDesktop()

  const { cart, addToCart, updateQuantity, getCartQuantity, cartItemCount, clearCart } = useB2BCart()
  const { gridClassName, options, columnCount, selectCols } = useB2BGridDensity()

  const {
    data: products,
    total: totalProducts,
    isFetching,
    isLoading: productsLoading,
    filters,
    sorting,
    setSorting,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange
  } = useB2BProductsListQuery()

  const {
    pendingFilters,
    hasActiveFilters,
    hasPendingChanges,
    handleApplyFilters,
    handleClearFilters,
    updatePendingFilters
  } = useFilter<B2BProductsFilters>(
    filters,
    handleFiltersChange,
    () => handleFiltersChange(defaultB2BProductsFilters),
    defaultB2BProductsFilters
  )

  const { data: categories = [], isLoading: categoriesLoading } = useB2BCategoriesQuery(filters.brandId)
  const { data: brands = [], isLoading: brandsLoading } = useB2BBrandsQuery(filters.categoryId)

  const showProductSkeleton = productsLoading || (isFetching && products.length === 0)

  const totalCatalogProductCount = useMemo(
    () => categories.reduce((sum, category) => sum + (category.productCount ?? 0), 0),
    [categories]
  )

  const createB2BOrderMutation = useCreateB2BOrderMutation()

  const selectedCategoryIds = useMemo(() => parseB2BFilterSelection(filters.categoryId), [filters.categoryId])
  const selectedBrandIds = useMemo(() => parseB2BFilterSelection(filters.brandId), [filters.brandId])
  const selectedCatalogFilterCount = selectedCategoryIds.length + selectedBrandIds.length

  useEffect(() => {
    if (selectedBrandIds.length === 0) return

    const availableBrandIds = new Set(brands.map(brand => brand.id))
    const nextBrandIds = selectedBrandIds.filter(brandId => availableBrandIds.has(brandId))

    if (nextBrandIds.length !== selectedBrandIds.length) {
      handleFiltersChange({ ...filters, brandId: serializeB2BFilterSelection(nextBrandIds) })
    }
  }, [brands, filters, handleFiltersChange, selectedBrandIds])

  useEffect(() => {
    if (selectedCategoryIds.length === 0) return

    const enabledCategoryIds = new Set(
      categories.filter(category => (category.productCount ?? 0) > 0).map(category => category.id)
    )
    const nextCategoryIds = selectedCategoryIds.filter(categoryId => enabledCategoryIds.has(categoryId))

    if (nextCategoryIds.length !== selectedCategoryIds.length) {
      handleFiltersChange({ ...filters, categoryId: serializeB2BFilterSelection(nextCategoryIds) })
    }
  }, [categories, filters, handleFiltersChange, selectedCategoryIds])

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + getB2BUnitPrice(item.product) * item.quantity, 0),
    [cart]
  )

  const canOrder = cartTotal >= MIN_B2B_ORDER_AMOUNT

  const applyCategorySelection = (categoryIds: string[]) => {
    const nextCategoryId = serializeB2BFilterSelection(categoryIds)
    updatePendingFilters({ categoryId: nextCategoryId })
    handleFiltersChange({ ...filters, categoryId: nextCategoryId })
  }

  const applyBrandSelection = (brandIds: string[]) => {
    const nextBrandId = serializeB2BFilterSelection(brandIds)
    updatePendingFilters({ brandId: nextBrandId })
    handleFiltersChange({ ...filters, brandId: nextBrandId })
  }

  const handlePlaceOrder = async () => {
    if (!canOrder || cart.length === 0 || createB2BOrderMutation.isPending) return

    try {
      const result = await createB2BOrderMutation.mutateAsync({
        items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity }))
      })

      clearCart()
      setIsCartSheetOpen(false)
      setOrderResult(result)
    } catch {
      // Hata: global axios / toast middleware
    }
  }

  return (
    <div className='flex flex-col gap-5 pb-6 max-sm:p-0 xl:flex-row xl:items-start'>
      {isDesktop && (
        <B2BCatalogSidebar
          categories={categories}
          brands={brands}
          selectedCategoryIds={selectedCategoryIds}
          selectedBrandIds={selectedBrandIds}
          totalProductCount={totalCatalogProductCount}
          onSelectCategories={applyCategorySelection}
          onSelectBrands={applyBrandSelection}
          isCategoriesLoading={categoriesLoading}
          isBrandsLoading={brandsLoading}
        />
      )}

      <Card className='border-border/70 min-w-0 flex-1 overflow-hidden shadow-sm'>
        <CardHeader className='flex flex-row items-center justify-between gap-3 bg-linear-to-r'>
          <div className='min-w-0 space-y-1'>
            <CardTitle className='truncate'>Tedarik ürünleri</CardTitle>

            {showProductSkeleton ? (
              <Skeleton className='h-3 w-36 rounded-md' />
            ) : (
              <p className='text-muted-foreground flex min-h-4 items-center text-xs'>
                {totalProducts} ürün listeleniyor
              </p>
            )}
          </div>
          <div className='flex flex-row items-center gap-2'>
            <Button
              variant='outline'
              size='xs'
              className='relative gap-2 shadow-xs xl:hidden'
              onClick={() => setIsCartSheetOpen(true)}
            >
              <ShoppingCart className='size-4' />
              <span>Sepet</span>
              {cartItemCount > 0 && (
                <span className='bg-primary text-primary-foreground ring-card absolute -top-2 -right-2 flex min-w-5 items-center justify-center rounded-full px-1 text-sm font-medium ring-2'>
                  {cartItemCount}
                </span>
              )}
            </Button>
            <B2BGridDensityToolbar options={options} columnCount={columnCount} onSelectCols={selectCols} />
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

            <SortSelect
              sortByOptions={sortByOptions}
              sorting={sorting}
              onSortingChange={setSorting}
              placeholder='Sıralama'
            />
          </FilterCard>

          {!isDesktop && (
            <div className='space-y-2'>
              <Button
                type='button'
                variant='outline'
                className='h-10 w-full justify-between gap-3 px-3 shadow-xs'
                aria-expanded={isMobileCatalogOpen}
                onClick={() => setIsMobileCatalogOpen(prev => !prev)}
              >
                <span className='flex min-w-0 items-center gap-2'>
                  <SlidersHorizontal className='text-primary size-4 shrink-0' />
                  <span className='truncate'>Kategori / Marka</span>
                  {selectedCatalogFilterCount > 0 && (
                    <span className='bg-primary/10 text-primary shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold'>
                      {selectedCatalogFilterCount}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn('size-4 shrink-0 transition-transform', isMobileCatalogOpen && 'rotate-180')}
                />
              </Button>

              <AnimatePresence initial={false}>
                {isMobileCatalogOpen && (
                  <motion.div
                    key='mobile-b2b-catalog'
                    initial={{ height: 0, opacity: 0, y: -4 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className='overflow-hidden'
                  >
                    <B2BCatalogSidebar
                      categories={categories}
                      brands={brands}
                      selectedCategoryIds={selectedCategoryIds}
                      selectedBrandIds={selectedBrandIds}
                      totalProductCount={totalCatalogProductCount}
                      onSelectCategories={applyCategorySelection}
                      onSelectBrands={applyBrandSelection}
                      isCategoriesLoading={categoriesLoading}
                      isBrandsLoading={brandsLoading}
                      className='shadow-none'
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {showProductSkeleton || isFetching ? (
            <B2BProductGridSkeleton gridClassName={gridClassName} count={columnCount * 2} />
          ) : (
            <div className={cn('grid gap-2 sm:gap-4', gridClassName)}>
              {products.map((product, index) => {
                const cartQty = getCartQuantity(product.id)
                return (
                  <B2BProductCard
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
          )}

          {products.length === 0 && !isFetching && !showProductSkeleton && (
            <div className='bg-secondary/20 border-border/60 rounded-xl border border-dashed py-16 text-center'>
              <div className='bg-background mx-auto mb-4 flex size-16 items-center justify-center rounded-full shadow-sm'>
                <Package className='text-muted-foreground/35 size-8' />
              </div>
              <p className='text-muted-foreground text-sm'>Ürün bulunamadı</p>
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

      <aside className='border-border/70 bg-card sticky top-20 hidden h-auto max-h-[calc(100vh-12rem)] w-80 shrink-0 flex-col overflow-hidden rounded-xl border shadow-sm xl:flex 2xl:w-84'>
        <B2BCartHeader cartItemCount={cartItemCount} compact />
        <div className='min-h-0 flex-1 overflow-y-auto p-3'>
          <B2BCartItemsList cart={cart} onUpdateQuantity={updateQuantity} compact />
        </div>
        <div className='shrink-0'>
          <B2BCartCheckoutSection
            cart={cart}
            cartTotal={cartTotal}
            minOrderAmount={MIN_B2B_ORDER_AMOUNT}
            canOrder={canOrder}
            compact
            isSubmitting={createB2BOrderMutation.isPending}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </aside>

      <B2BCartSheet
        open={isCartSheetOpen}
        onOpenChange={setIsCartSheetOpen}
        cart={cart}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        minOrderAmount={MIN_B2B_ORDER_AMOUNT}
        canOrder={canOrder}
        onUpdateQuantity={updateQuantity}
        onPlaceOrder={handlePlaceOrder}
        isSubmitting={createB2BOrderMutation.isPending}
      />

      <B2BOrderResultDialog
        open={Boolean(orderResult)}
        orderId={orderResult?.orderId}
        message={orderResult?.message}
        onOpenChange={open => {
          if (!open) setOrderResult(null)
        }}
      />
    </div>
  )
}
