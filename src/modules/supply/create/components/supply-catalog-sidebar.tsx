'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import type { SupplyBrand, SupplyCategory } from '../types'

interface SupplyCatalogSidebarProps {
  categories: SupplyCategory[]
  brands: SupplyBrand[]
  selectedCategoryIds: string[]
  selectedBrandIds: string[]
  totalProductCount: number
  onSelectCategories: (categoryIds: string[]) => void
  onSelectBrands: (brandIds: string[]) => void
  className?: string
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
      <p className='text-muted-foreground px-1 text-xs font-medium tracking-wide uppercase'>{title}</p>
      <Input
        Icon={Search}
        value={searchValue}
        onChange={event => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        size='sm'
        className='h-8 text-xs'
      />
      <div className='flex flex-col gap-0.5'>{children}</div>
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
        'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors',
        isChecked ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted/80',
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
        'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
        isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted/80'
      )}
    >
      <span className='min-w-0 flex-1 truncate'>{label}</span>
      <span className={cn('shrink-0 tabular-nums', isActive ? 'text-primary' : 'text-muted-foreground')}>{count}</span>
    </button>
  )
}

export function SupplyCatalogSidebar({
  categories,
  brands,
  selectedCategoryIds,
  selectedBrandIds,
  totalProductCount,
  onSelectCategories,
  onSelectBrands,
  className
}: SupplyCatalogSidebarProps) {
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
        'bg-card text-card-foreground border-border w-full shrink-0 rounded-md border shadow-sm',
        'xl:w-56',
        className
      )}
    >
      <div className='space-y-6 p-3'>
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

        {brands.length > 0 && (
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
        )}
      </div>
    </aside>
  )
}
