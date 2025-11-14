'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Filter, FilterX, LayoutGrid, LayoutList, Loader2, Menu, RefreshCw } from 'lucide-react'
import { useOrders } from '../../context/OrdersContext'
import { CreateOrderModal } from '../actions/CreateOrderModal'

const viewModeButtons = [
  {
    label: 'Kart Görünümü',
    Icon: LayoutGrid,
    value: 'card' as const
  },
  {
    label: 'Liste Görünümü',
    Icon: LayoutList,
    value: 'list' as const
  }
]

interface OrdersToolbarProps {
  viewMode: 'card' | 'list'
  onViewModeChange: (mode: 'card' | 'list') => void
  showFilters: boolean
  onToggleFilters: () => void
}

export function OrdersToolbar({ viewMode, onViewModeChange, showFilters, onToggleFilters }: OrdersToolbarProps) {
  const { refreshAllData, isFetchingActive, isFetchingCompleted, handleCreateOrderSuccess } = useOrders()

  const isRefreshing = isFetchingActive || isFetchingCompleted
  return (
    <div className='flex flex-row-reverse flex-wrap items-center gap-2'>
      {/* Mobile Dropdown Menu (lg: altında) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='soft' color='secondary' size='icon' className='lg:hidden'>
            <Menu className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={refreshAllData} disabled={isRefreshing} className='flex items-center'>
            {isRefreshing ? <Loader2 className='size-4 animate-spin' /> : <RefreshCw className='size-4' />}
            <span className='ml-2'>Yenile</span>
          </DropdownMenuItem>
          {viewModeButtons.map(({ label, Icon, value }) => (
            <DropdownMenuItem key={value} onClick={() => onViewModeChange(value)}>
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
        <RefreshButton onClick={refreshAllData} isIconButton isLoading={isRefreshing} />
        <ButtonGroup>
          {viewModeButtons.map(({ label, Icon, value }) => (
            <Button
              key={value}
              variant={viewMode === value ? null : 'soft'}
              size='xs'
              title={label}
              onClick={() => onViewModeChange(value)}
            >
              <Icon className='size-4' />
              <span className='sr-only'>{label}</span>
            </Button>
          ))}
        </ButtonGroup>
        <Button color='primary' onClick={onToggleFilters}>
          {showFilters ? <FilterX className='size-4' /> : <Filter className='size-4' />}
          <span className='ml-2'>{showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}</span>
        </Button>
      </div>
      <CreateOrderModal onSuccess={handleCreateOrderSuccess} />
    </div>
  )
}
