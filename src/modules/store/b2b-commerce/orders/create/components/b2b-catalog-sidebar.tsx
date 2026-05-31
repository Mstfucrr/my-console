'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { B2BSidebarSectionSkeleton } from '../../../components/b2b-commerce-loading-skeletons'
import type { B2BBrand, B2BCategory } from '../../../types'

interface B2BCatalogSidebarProps {
  categories: B2BCategory[]
  brands: B2BBrand[]
  selectedCategoryIds: string[]
  selectedBrandIds: string[]
  totalProductCount: number
  onSelectCategories: (categoryIds: string[]) => void
  onSelectBrands: (brandIds: string[]) => void
  className?: string
  isCategoriesLoading?: boolean
  isBrandsLoading?: boolean
}

function SidebarSection({
  title,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children
}: {
  title: string
  searchPlaceholder: string
  searchValue: string
  onSearchChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <div className='space-y-2.5'>
      <p className='text-muted-foreground px-1 text-xs font-semibold tracking-wide uppercase'>{title}</p>
      <Input
        Icon={Search}
        value={searchValue}
        onChange={event => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        size='sm'
        className='bg-background/70 h-8 text-xs shadow-xs'
      />
      <div className='flex max-h-64 flex-col gap-0.5 overflow-y-auto pr-1 md:max-h-80 xl:max-h-[400px]'>{children}</div>
    </div>
  )
}

function SidebarRow({
  label,
  count,
  isChecked,
  disabled = false,
  onToggle
}: {
  label: string
  count: number
  isChecked: boolean
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <div
      role='button'
      tabIndex={disabled && !isChecked ? -1 : 0}
      onClick={disabled && !isChecked ? undefined : onToggle}
      onKeyDown={event => {
        if (disabled && !isChecked) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onToggle()
        }
      }}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all',
        isChecked
          ? 'bg-primary/10 text-primary ring-primary/15 font-medium shadow-xs ring-1'
          : 'text-foreground hover:bg-muted/80',
        disabled && !isChecked
          ? 'text-muted-foreground cursor-not-allowed opacity-60 hover:bg-transparent'
          : 'cursor-pointer'
      )}
      aria-disabled={disabled && !isChecked}
    >
      <Checkbox
        size='sm'
        checked={isChecked}
        disabled={disabled && !isChecked}
        tabIndex={-1}
        aria-hidden='true'
        className='pointer-events-none'
        aria-label={label}
      />
      <span className='min-w-0 flex-1 truncate'>{label}</span>
      <span className={cn('shrink-0 tabular-nums', isChecked ? 'text-primary' : 'text-muted-foreground')}>{count}</span>
    </div>
  )
}

function SidebarClearButton({
  label,
  count,
  isActive,
  onClick
}: {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-all',
        isActive
          ? 'bg-primary/10 text-primary ring-primary/15 font-medium shadow-xs ring-1'
          : 'text-foreground hover:bg-muted/80'
      )}
    >
      <span className='min-w-0 flex-1 truncate'>{label}</span>
      <span className={cn('shrink-0 tabular-nums', isActive ? 'text-primary' : 'text-muted-foreground')}>{count}</span>
    </button>
  )
}

export function B2BCatalogSidebar({
  categories,
  brands,
  selectedCategoryIds,
  selectedBrandIds,
  totalProductCount,
  onSelectCategories,
  onSelectBrands,
  className,
  isCategoriesLoading = false,
  isBrandsLoading = false
}: B2BCatalogSidebarProps) {
  const [categorySearch, setCategorySearch] = useState('')
  const [brandSearch, setBrandSearch] = useState('')
  const totalBrandScope = brands.reduce((sum, b) => sum + (b.productCount ?? 0), 0)
  const isAllCategoriesSelected = selectedCategoryIds.length === 0
  const isAllBrandsSelected = selectedBrandIds.length === 0

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLocaleLowerCase('tr-TR')
    if (!query) return categories

    return categories.filter(category => category.name.toLocaleLowerCase('tr-TR').includes(query))
  }, [categories, categorySearch])

  const filteredBrands = useMemo(() => {
    const query = brandSearch.trim().toLocaleLowerCase('tr-TR')
    if (!query) return brands

    return brands.filter(brand => brand.name.toLocaleLowerCase('tr-TR').includes(query))
  }, [brands, brandSearch])

  const toggleCategory = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onSelectCategories(selectedCategoryIds.filter(id => id !== categoryId))
      return
    }

    onSelectCategories([...selectedCategoryIds, categoryId])
  }

  const toggleBrand = (brandId: string) => {
    if (selectedBrandIds.includes(brandId)) {
      onSelectBrands(selectedBrandIds.filter(id => id !== brandId))
      return
    }

    onSelectBrands([...selectedBrandIds, brandId])
  }

  return (
    <aside
      className={cn(
        'bg-card max-h-[calc(100vh-10rem)] w-full shrink-0 overflow-y-auto rounded-md border shadow-sm backdrop-blur',
        'xl:sticky xl:top-24 xl:w-56',
        className
      )}
      style={{
        scrollbarWidth: 'thin'
      }}
    >
      <div className='grid gap-4 p-3 md:grid-cols-2 xl:block xl:space-y-6'>
        {isCategoriesLoading ? (
          <B2BSidebarSectionSkeleton title='Kategoriler' rowCount={7} />
        ) : (
          <SidebarSection
            title='Kategoriler'
            searchPlaceholder='Kategori ara...'
            searchValue={categorySearch}
            onSearchChange={setCategorySearch}
          >
            <SidebarClearButton
              label='Tüm Kategoriler'
              count={totalProductCount}
              isActive={isAllCategoriesSelected}
              onClick={() => onSelectCategories([])}
            />
            {filteredCategories.map(category => (
              <SidebarRow
                key={category.id}
                label={category.name}
                count={category.productCount ?? 0}
                isChecked={selectedCategoryIds.includes(category.id)}
                disabled={(category.productCount ?? 0) === 0}
                onToggle={() => toggleCategory(category.id)}
              />
            ))}
          </SidebarSection>
        )}

        {(brands.length > 0 || isBrandsLoading) &&
          (isBrandsLoading && brands.length === 0 ? (
            <B2BSidebarSectionSkeleton title='Markalar' rowCount={5} />
          ) : (
            <SidebarSection
              title='Markalar'
              searchPlaceholder='Marka ara...'
              searchValue={brandSearch}
              onSearchChange={setBrandSearch}
            >
              <SidebarClearButton
                label='Tüm Markalar'
                count={totalBrandScope}
                isActive={isAllBrandsSelected}
                onClick={() => onSelectBrands([])}
              />
              {filteredBrands.map(brand => (
                <SidebarRow
                  key={brand.id}
                  label={brand.name}
                  count={brand.productCount ?? 0}
                  isChecked={selectedBrandIds.includes(brand.id)}
                  onToggle={() => toggleBrand(brand.id)}
                />
              ))}
            </SidebarSection>
          ))}
      </div>
    </aside>
  )
}
