'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useOrders } from '../../context/OrdersContext'

export function OrdersSearch() {
  const { searchTerm, setSearchTerm } = useOrders()
  const isActive = searchTerm && searchTerm.length > 0

  return (
    <div className='relative max-w-md flex-1'>
      <Search className='text-muted-foreground absolute top-1/2 left-3 z-1 h-4 w-4 -translate-y-1/2' />
      <Input
        placeholder='Sipariş ID, müşteri adı, telefon numarası ile arama yapın...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className='pl-10'
        color={isActive ? 'primary' : undefined}
        variant={isActive ? 'faded' : 'bordered'}
      />
    </div>
  )
}
