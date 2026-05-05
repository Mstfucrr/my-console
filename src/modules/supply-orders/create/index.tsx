'use client'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FilterCard, SearchInput, SortSelect, type FilterOption } from '@/components/ui/filter-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFilter } from '@/hooks/use-filter'
import { useIsDesktop } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { SupplyProductGridSkeleton } from '@/modules/supply-orders/components/supply-loading-skeletons'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Package, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SupplyCartSheet } from './components/supply-cart-sheet'
import { SupplyCatalogSidebar } from './components/supply-catalog-sidebar'
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
import { parseSupplyFilterSelection, serializeSupplyFilterSelection } from './utils/supply-filter-selection'
import { getSupplyUnitPrice } from './utils/supply-price'

const sortByOptions: FilterOption[] = [
  { value: 'name', label: 'Ürün Adı' },
  { value: 'price', label: 'Fiyat' }
]

export default function SupplyOrdersCreateView() {
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false)
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false)
  const [orderResult, setOrderResult] = useState<{ orderId: string; message: string } | null>(null)
  const isDesktop = useIsDesktop()

  const { cart, addToCart, updateQuantity, getCartQuantity, cartItemCount, clearCart } = useSupplyCart()
  const { gridClassName, options, columnCount, selectCols } = useSupplyGridDensity()

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

  const { data: categories = [], isLoading: categoriesLoading } = useSupplyCategoriesQuery(filters.brandId)
  const { data: brands = [], isLoading: brandsLoading } = useSupplyBrandsQuery(filters.categoryId)

  const showProductSkeleton = productsLoading || (isFetching && products.length === 0)

  const totalCatalogProductCount = useMemo(
    () => categories.reduce((sum, category) => sum + (category.productCount ?? 0), 0),
    [categories]
  )

  const createSupplyOrderMutation = useCreateSupplyOrderMutation()

  const selectedCategoryIds = useMemo(() => parseSupplyFilterSelection(filters.categoryId), [filters.categoryId])
  const selectedBrandIds = useMemo(() => parseSupplyFilterSelection(filters.brandId), [filters.brandId])
  const selectedCatalogFilterCount = selectedCategoryIds.length + selectedBrandIds.length

  useEffect(() => {
    if (selectedBrandIds.length === 0) return

    const availableBrandIds = new Set(brands.map(brand => brand.id))
    const nextBrandIds = selectedBrandIds.filter(brandId => availableBrandIds.has(brandId))

    if (nextBrandIds.length !== selectedBrandIds.length) {
      handleFiltersChange({ ...filters, brandId: serializeSupplyFilterSelection(nextBrandIds) })
    }
  }, [brands, filters, handleFiltersChange, selectedBrandIds])

  useEffect(() => {
    if (selectedCategoryIds.length === 0) return

    const enabledCategoryIds = new Set(
      categories.filter(category => (category.productCount ?? 0) > 0).map(category => category.id)
    )
    const nextCategoryIds = selectedCategoryIds.filter(categoryId => enabledCategoryIds.has(categoryId))

    if (nextCategoryIds.length !== selectedCategoryIds.length) {
      handleFiltersChange({ ...filters, categoryId: serializeSupplyFilterSelection(nextCategoryIds) })
    }
  }, [categories, filters, handleFiltersChange, selectedCategoryIds])

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + getSupplyUnitPrice(item.product) * item.quantity, 0),
    [cart]
  )

  const canOrder = cartTotal >= MIN_SUPPLY_ORDER_AMOUNT

  const applyCategorySelection = (categoryIds: string[]) => {
    const nextCategoryId = serializeSupplyFilterSelection(categoryIds)
    updatePendingFilters({ categoryId: nextCategoryId })
    handleFiltersChange({ ...filters, categoryId: nextCategoryId })
  }

  const applyBrandSelection = (brandIds: string[]) => {
    const nextBrandId = serializeSupplyFilterSelection(brandIds)
    updatePendingFilters({ brandId: nextBrandId })
    handleFiltersChange({ ...filters, brandId: nextBrandId })
  }

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
      // Hata: global axios / toast middleware
    }
  }

  return (
    <div className='flex flex-col gap-5 pb-6 max-sm:p-0 xl:flex-row xl:items-start'>
      {isDesktop && (
        <SupplyCatalogSidebar
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
              className='relative gap-2 shadow-xs'
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
                    key='mobile-supply-catalog'
                    initial={{ height: 0, opacity: 0, y: -4 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className='overflow-hidden'
                  >
                    <SupplyCatalogSidebar
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
            <SupplyProductGridSkeleton gridClassName={gridClassName} count={columnCount * 2} />
          ) : (
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
    </div>
  )
}
