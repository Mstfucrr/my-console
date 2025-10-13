'use client'

import { Motorcycle } from '@/components/svg'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { getStatusColor } from '@/constants'
import { formatCurrency } from '@/lib/formatCurrency'
import { cn } from '@/lib/utils'
import type { Order, OrderStatus } from '@/modules/types'
import { OrderStatusLabel } from '@/modules/types'
import { Clock, CreditCard, Eye, Eye as EyeIcon, EyeOff, MapPin, Phone, Trash, User } from 'lucide-react'
import { useState } from 'react'
import { formatDateTR } from '../utils'

interface OrderCardProps {
  order: Order
  onViewDetails: (order: Order) => void
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus) => void
  onCancel?: (orderId: string) => void
  showActions?: boolean
}

const getPaymentMethodLabel = (method: string) => {
  const methodMap: Record<string, string> = {
    cash: 'Nakit',
    card: 'Kart',
    online: 'Online'
  }
  return methodMap[method] || method
}

const getPaymentMethodColor = (method: string) => {
  const colorMap: Record<string, string> = {
    cash: 'bg-green-100 text-green-800',
    card: 'bg-blue-100 text-blue-800',
    online: 'bg-purple-100 text-purple-800'
  }
  return colorMap[method] || 'bg-gray-100 text-gray-800'
}

const getIntegrationLabel = (integration: string) => {
  const integrationMap: Record<string, string> = {
    yemeksepeti: 'Yemeksepeti',
    getir: 'Getir',
    trendyol_go: 'Trendyol Go',
    migros_yemek: 'Migros Yemek',
    tikla_gelsin: 'Tıkla Gelsin',
    manuel: 'Manuel'
  }
  return integrationMap[integration] || integration
}

const getIntegrationColor = (integration: string) => {
  const colorMap: Record<string, string> = {
    yemeksepeti: 'bg-red-100 text-red-800',
    getir: 'bg-purple-100 text-purple-800',
    trendyol_go: 'bg-orange-100 text-orange-800',
    migros_yemek: 'bg-green-100 text-green-800',
    tikla_gelsin: 'bg-blue-100 text-blue-800',
    manuel: 'bg-gray-100 text-gray-800'
  }
  return colorMap[integration] || 'bg-gray-100 text-gray-800'
}

const getIntegrationIcon = (integration: string) => {
  const iconMap: Record<string, string> = {
    yemeksepeti: '🥘',
    getir: '⚡',
    trendyol_go: '🛒',
    migros_yemek: '🛍️',
    tikla_gelsin: '📱',
    manuel: '✋'
  }
  return iconMap[integration] || '📦'
}

// Masking helpers
const maskPhone = (phone: string) => {
  // Show only first 3 and last 2 digits, mask the rest
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 5) return '*'.repeat(digits.length)
  return `${digits.slice(0, 3)}${'*'.repeat(digits.length - 5)}${digits.slice(-2)}`
}

const maskAddress = (address: string) => {
  // Show only first 8 chars, mask the rest except last 4
  if (!address) return ''
  if (address.length <= 12) return address[0] + '*'.repeat(address.length - 2) + address[address.length - 1]
  return `${address.slice(0, 8)}${'*'.repeat(6)}`
}

export function OrderCard({ order, onViewDetails, onCancel }: OrderCardProps) {
  // Check if order needs urgent attention (pending status)
  const isUrgent = order.status === 'created'

  // Beklemede ve kurye ataması yapılmadıysa iptal edilebilir
  const canCancel = order.status === 'created' && !order.courierInfo

  // State for masking
  const [showPhone, setShowPhone] = useState(false)
  const [showAddress, setShowAddress] = useState(false)

  return (
    <Card className={cn('mb-3 transition-shadow hover:shadow-md', isUrgent && 'border-red-500 bg-red-50')}>
      <CardContent className='p-4 pb-0'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            {/* Sipariş ID ve Durum */}
            <div className='mb-2 flex flex-wrap items-center gap-2'>
              <h3 className='text-foreground flex items-center gap-2 truncate text-sm font-medium'>
                {order.id}
                {isUrgent && <span className='animate-pulse text-red-500'>🔥</span>}
              </h3>
              <Badge className={getStatusColor(order.status)}>{OrderStatusLabel[order.status as OrderStatus]}</Badge>
              {isUrgent && (
                <Badge variant='outline' className='border-red-600 text-xs font-bold text-red-600'>
                  ACİL!
                </Badge>
              )}
              {order.courierInfo && <Motorcycle className='size-7' />}
            </div>

            {/* Ödeme Yöntemi ve Entegrasyon */}
            <div className='mb-3 flex flex-wrap items-center gap-2'>
              <Badge className={`${getPaymentMethodColor(order.paymentMethod)} flex items-center gap-1`}>
                <CreditCard className='h-3 w-3' />
                {getPaymentMethodLabel(order.paymentMethod)}
              </Badge>
              <Badge className={`${getIntegrationColor(order.integration)} flex items-center gap-1`}>
                <span>{getIntegrationIcon(order.integration)}</span>
                {getIntegrationLabel(order.integration)}
              </Badge>
            </div>

            {/* Müşteri Bilgileri */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <User className='text-muted-foreground h-3.5 w-3.5' />
                <span className='truncate text-sm font-medium'>{order.customerName}</span>
              </div>

              <div className='flex items-center gap-2'>
                <Phone className='text-muted-foreground h-3.5 w-3.5' />
                <span className='text-muted-foreground text-sm'>
                  {showPhone ? order.customerPhone : maskPhone(order.customerPhone)}
                </span>
                <button
                  type='button'
                  className='hover:bg-muted ml-1 rounded p-0.5 transition-colors'
                  aria-label={showPhone ? 'Telefonu gizle' : 'Telefonu göster'}
                  onClick={() => setShowPhone(v => !v)}
                  tabIndex={0}
                >
                  {showPhone ? (
                    <EyeOff className='text-muted-foreground size-3.5' />
                  ) : (
                    <EyeIcon className='text-muted-foreground size-3.5' />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Tutar ve Zaman */}
          <div className='min-w-[120px] text-right'>
            <div className='text-warning mb-1 text-lg font-bold'>{formatCurrency(order.totalAmount)}</div>

            <div className='mb-2 flex items-center justify-end gap-1'>
              <Clock className='text-muted-foreground h-3 w-3' />
              <span className='text-muted-foreground text-xs'>{formatDateTR(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-center justify-between gap-2'>
          <div className='flex items-start gap-2'>
            <MapPin className='text-muted-foreground mt-0.5 h-3.5 w-3.5' />
            <span className='text-muted-foreground line-clamp-2 text-xs'>
              {showAddress ? order.customerAddress : maskAddress(order.customerAddress)}
            </span>
            <button
              type='button'
              className='hover:bg-muted ml-1 rounded p-0.5 transition-colors'
              aria-label={showAddress ? 'Adresi gizle' : 'Adresi göster'}
              onClick={() => setShowAddress(v => !v)}
              tabIndex={0}
            >
              {showAddress ? (
                <EyeOff className='text-muted-foreground size-3.5' />
              ) : (
                <EyeIcon className='text-muted-foreground size-3.5' />
              )}
            </button>
          </div>
          <div className='flex items-center gap-2 self-end'>
            <Button variant='outline' className='flex items-center gap-1' onClick={() => onViewDetails(order)}>
              <Eye className='size-3' />
              <span className='max-sm:hidden'>Detay</span>
            </Button>
            {canCancel && (
              <Button
                variant='outline'
                color='destructive'
                className='flex items-center gap-1'
                onClick={() => onCancel?.(order.id)}
              >
                <Trash className='size-3' />
                <span className='max-sm:hidden'>İptal</span>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
