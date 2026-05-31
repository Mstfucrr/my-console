'use client'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FilterCard, SearchInput, SortSelect, type FilterOption } from '@/components/ui/filter-card'
import { useFilter } from '@/hooks/use-filter'
import { useIsDesktop } from '@/hooks/use-media-query'
import { formatCurrency } from '@/lib/formatCurrency'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Package, Search, ShoppingBasket, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { B2BProductGridSkeleton } from '../../components/b2b-commerce-loading-skeletons'
import { parseB2BFilterSelection, serializeB2BFilterSelection } from '../../utils/b2b-filter-selection'
import { B2BCartAside } from './components/b2b-cart-aside'
import { B2BCartSheet } from './components/b2b-cart-sheet'
import { B2BCatalogSidebar } from './components/b2b-catalog-sidebar'
import { B2BDeliveryAddressDialog } from './components/b2b-delivery-address-dialog'
import { B2BGridDensityToolbar } from './components/b2b-grid-density-toolbar'
import { B2BOrderConfirmAlert } from './components/b2b-order-confirm-alert'
import { B2BOrderResultDialog } from './components/b2b-order-result-dialog'
import { B2BProductCard } from './components/b2b-product-card'
import { B2BCheckoutProvider, useB2BCheckout } from './context/B2BCheckoutContext'
import { useB2BBrandsQuery } from './hooks/useB2BBrandsQuery'
import { useB2BCategoriesQuery } from './hooks/useB2BCategoriesQuery'
import { useB2BGridDensity } from './hooks/useB2BGridDensity'
import {
  defaultB2BProductsFilters,
  useB2BProductsListQuery,
  type B2BProductsFilters
} from './hooks/useB2BProductsListQuery'

const sortByOptions: FilterOption[] = [
  { value: 'name', label: 'Ürün Adı' },
  { value: 'price', label: 'Fiyat' }
]

function B2BCommerceOrderCreateContent() {
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false)
  const isDesktop = useIsDesktop()
  const { cartItemCount, openCartSheet, orderResult, cartTotal, closeOrderResult } = useB2BCheckout()
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

  return (
    <div className='flex flex-col gap-4 pb-6 max-sm:p-0 md:flex-row md:items-start'>
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
            <CardTitle className='truncate'>Tedarik Ürünleri {totalProducts > 0 && `(${totalProducts})`}</CardTitle>
          </div>
          <div className='flex flex-row items-center gap-2'>
            <Button
              color={cartTotal > 0 ? 'default' : 'secondary'}
              size='sm'
              className='fixed bottom-20 left-[calc(50%-10rem)] z-50 gap-2 text-sm shadow-xs lg:hidden'
              onClick={openCartSheet}
            >
              <ShoppingBasket className='size-4' />
              <span>Sepet</span>
              {cartItemCount > 0 && (
                <span className='bg-primary text-primary-foreground ring-card absolute -top-2 -right-2 flex min-w-5 items-center justify-center rounded-full px-1 text-sm font-medium ring-2'>
                  {cartItemCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className='bg-primary text-primary-foreground ring-card absolute -right-2 -bottom-3 flex min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium ring-2'>
                  {formatCurrency(cartTotal)}
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
              {products.map((product, index) => (
                <B2BProductCard key={product.id} product={product} index={index} columnCount={columnCount} />
              ))}
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

      <B2BCartAside />
      <B2BCartSheet />
      <B2BOrderConfirmAlert />
      <B2BDeliveryAddressDialog />

      <B2BOrderResultDialog
        open={Boolean(orderResult)}
        message={orderResult?.message}
        onOpenChange={open => {
          if (!open) closeOrderResult()
        }}
      />
    </div>
  )
}

export default function B2BCommerceOrderCreateView() {
  return (
    <B2BCheckoutProvider>
      <B2BCommerceOrderCreateContent />
    </B2BCheckoutProvider>
  )
}
