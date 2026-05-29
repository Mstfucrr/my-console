'use client'

import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FilterToggleButton } from '@/components/ui/filter-card'
import { useViewModeStore } from '@/store/view-mode'
import { Filter, FilterX, LayoutGrid, Loader2, Menu, RefreshCw, Table } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'

const viewModeButtons = [
  {
    label: 'Kart Görünümü',
    Icon: LayoutGrid,
    value: 'card' as const
  },
  {
    label: 'Tablo Görünümü',
    Icon: Table,
    value: 'table' as const
  }
]

interface OrdersToolbarProps {
  showFilters: boolean
  onToggleFilters: () => void
}

export function OrdersToolbar({ showFilters, onToggleFilters }: OrdersToolbarProps) {
  const { refreshAllData, isFetching } = useOrders()
  const { viewMode, setViewMode } = useViewModeStore()

  return (
    <div className='flex flex-row-reverse flex-wrap items-center gap-2'>
      {/* Mobile Dropdown Menu (lg: altında) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='soft' color='secondary' size='icon-sm' className='lg:hidden'>
            <Menu className='size-4.5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={refreshAllData} disabled={isFetching} className='flex items-center'>
            {isFetching ? <Loader2 className='size-4 animate-spin' /> : <RefreshCw className='size-4' />}
            <span className='ml-2'>Yenile</span>
          </DropdownMenuItem>
          {viewModeButtons.map(({ label, Icon, value }) => (
            <DropdownMenuItem key={value} onClick={() => setViewMode(value)}>
              <Icon className='size-4' />
              <span className='ml-2'>{label}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={onToggleFilters}>
            {showFilters ? <FilterX className='size-4' /> : <Filter className='size-4' />}
            <span className='ml-2'>{showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Desktop Toolbar (lg: ve üzeri) */}
      <div className='hidden flex-wrap items-center gap-2 lg:flex'>
        <RefreshButton onClick={refreshAllData} isIconButton isLoading={isFetching} />
        <TooltippedElement tooltipContent='Görünüm Modunu Değiştir'>
          <ButtonGroup>
            {viewModeButtons.map(({ label, Icon, value }) => (
              <Button
                key={value}
                variant={viewMode === value ? null : 'soft'}
                size='icon-sm'
                onClick={() => setViewMode(value)}
              >
                <Icon className='size-4.5' />
                <span className='sr-only'>{label}</span>
              </Button>
            ))}
          </ButtonGroup>
        </TooltippedElement>
        <FilterToggleButton showFilters={showFilters} onToggle={onToggleFilters} color='primary' />
      </div>
    </div>
  )
}
