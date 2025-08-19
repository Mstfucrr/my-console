'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { cn } from '@/lib/utils'
import { orderStatusLabels } from '@/modules/mockData'
import type { Order, OrderStatus } from '@/modules/types'
import { Check, Clock, CreditCard, Eye, Flame, MapPin, Phone, Send, User, X } from 'lucide-react'
import { formatDateTR } from '../utils'

interface OrderCardProps {
  order: Order
  onViewDetails: (order: Order) => void
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus) => void
  onCancel?: (orderId: string) => void
  showActions?: boolean
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    picked_up: 'bg-purple-100 text-purple-800',
    on_way: 'bg-red-100 text-red-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
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

export function OrderCard({ order, onViewDetails, onStatusUpdate, onCancel, showActions = false }: OrderCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  // Check if order needs urgent attention (pending status)
  const isUrgent = order.status === 'pending'

  // Get next status actions based on current status
  const getActionButtons = () => {
    if (!showActions || !onStatusUpdate) return null

    const buttons = []

    switch (order.status) {
      case 'pending':
        buttons.push(
          <Button
            key='accept'
            onClick={() => onStatusUpdate(order.id, 'preparing')}
            className='bg-green-600 hover:bg-green-700'
          >
            <Check className='mr-1 h-3 w-3' />
            Kabul Et
          </Button>
        )
        if (onCancel) {
          buttons.push(
            <ConfirmButton
              key='cancel'
              confirmationMessage='Siparişi iptal et?'
              confirmButtonMessage='Evet'
              cancelButtonMessage='Hayır'
              variant='outline'
              onConfirm={() => onCancel(order.id)}
            >
              <X className='mr-1 h-3 w-3' />
              İptal
            </ConfirmButton>
          )
        }
        break

      case 'preparing':
        buttons.push(
          <Button
            key='prepared'
            onClick={() => onStatusUpdate(order.id, 'prepared')}
            className='bg-blue-600 hover:bg-blue-700'
          >
            <Flame className='mr-1 h-3 w-3' />
            Hazırlandı
          </Button>
        )
        break

      case 'prepared':
        buttons.push(
          <Button
            key='send'
            onClick={() => onStatusUpdate(order.id, 'ready')}
            className='bg-amber-600 text-white hover:bg-amber-700'
          >
            <Send className='mr-1 h-3 w-3' />
            Fiyuu Gönder
          </Button>
        )
        break
    }

    return buttons
  }

  return (
    <Card className={cn('mb-3 transition-shadow hover:shadow-md', isUrgent && 'border-red-500 bg-red-50')}>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            {/* Sipariş ID ve Durum */}
            <div className='mb-2 flex flex-wrap items-center gap-2'>
              <h3 className='text-foreground flex items-center gap-2 truncate text-sm font-medium'>
                {order.id}
                {isUrgent && <span className='animate-pulse text-red-500'>🔥</span>}
              </h3>
              <Badge className={getStatusColor(order.status)}>{orderStatusLabels[order.status as OrderStatus]}</Badge>
              {isUrgent && (
                <Badge variant='outline' className='border-red-600 text-xs font-bold text-red-600'>
                  ACİL!
                </Badge>
              )}
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
                <span className='text-muted-foreground text-sm'>{order.customerPhone}</span>
              </div>

              <div className='flex items-start gap-2'>
                <MapPin className='text-muted-foreground mt-0.5 h-3.5 w-3.5' />
                <span className='text-muted-foreground line-clamp-2 text-xs'>{order.customerAddress}</span>
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

            {/* Restoran Bilgisi */}
            <div className='text-muted-foreground mb-2 text-xs'>{order.restaurant.name}</div>

            {/* Action Buttons veya Detay Butonu */}
            <div className='flex flex-col items-end gap-2'>
              <div className='flex flex-row flex-wrap gap-2'>{getActionButtons()}</div>
              <Button variant='outline' onClick={() => onViewDetails(order)}>
                <Eye className='mr-1 h-3 w-3' />
                Detay
              </Button>
            </div>
          </div>
        </div>

        {/* Alt Kısım - Ürün Özeti */}
        <div className='mt-3 border-t pt-2'>
          <p className='text-muted-foreground text-xs'>
            {order.items.length} ürün: {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
