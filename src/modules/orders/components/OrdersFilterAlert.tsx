'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { orderStatusLabels } from '@/modules/mockData'
import { Search } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'

export function OrdersFilterAlert() {
  const { statusFilter, clearFilter, searchTerm } = useOrders()

  if ((!statusFilter || statusFilter.length === 0) && !searchTerm.trim().length) return null

  return (
    <Alert variant='outline' color='info'>
      <Search className='text-info size-5' />
      <AlertDescription className='flex items-start justify-between'>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Filtreleme aktif:</span>
          {statusFilter?.map(status => (
            <Badge key={status} variant='outline' className='bg-blue-100 text-blue-800'>
              {orderStatusLabels[status]}
            </Badge>
          ))}
          {searchTerm.trim().length > 0 && (
            <Badge variant='outline' className='bg-green-100 text-green-800'>
              Arama: {searchTerm}
            </Badge>
          )}
        </div>
        <Button variant='outline' color='info' onClick={clearFilter}>
          Filtreyi Temizle
        </Button>
      </AlertDescription>
    </Alert>
  )
}
