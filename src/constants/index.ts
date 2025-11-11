import { OrderStatus } from '@/modules/types'

// Status badge colors (for badges)
const getStatusColor = (status: OrderStatus) => {
  const colorMap: Record<OrderStatus, string> = {
    created: 'bg-orange-100 text-orange-800',
    shipped: 'bg-amber-100 text-amber-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

// Status text colors (for icons and text)
const getStatusTextColor = (status: OrderStatus) => {
  const colorMap: Record<OrderStatus, string> = {
    created: 'text-orange-600',
    shipped: 'text-amber-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600'
  }
  return colorMap[status] || 'text-gray-600'
}

// Status background colors (for stat cards)
const getStatusBgColor = (status: OrderStatus) => {
  const colorMap: Record<OrderStatus, string> = {
    created: 'bg-orange-50',
    shipped: 'bg-amber-50',
    delivered: 'bg-green-50',
    cancelled: 'bg-red-50'
  }
  return colorMap[status] || 'bg-gray-50'
}

export * from './icons'
export { getStatusBgColor, getStatusColor, getStatusTextColor }
