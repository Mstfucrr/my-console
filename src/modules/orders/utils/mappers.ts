import type { Order, OrderChannel, PaymentMethod } from '@/types'
import { OrderStatusesGroups } from '@/types'
import type {
  LatestOrderItemResponse,
  OrderDetailResponse,
  OrderListItemResponse,
  OrderStatsResponse
} from '../types/api'

// Backend response'larını frontend tiplerine map eden fonksiyonlar
// Channel string'den OrderChannel'a çevir
const channelMap: Record<string, OrderChannel> = {
  yemeksepeti: 'yemeksepeti',
  getir: 'getir',
  trendyolGo: 'trendyolGo',
  migrosYemek: 'migrosYemek',
  tiklaGelsin: 'tiklaGelsin',
  araGelsin: 'araGelsin',
  fiyuu: 'fiyuu',
  Console: 'manuel',
  manuel: 'manuel'
}

// PaymentType string'den PaymentMethod'a çevir
const paymentMap: Record<string, PaymentMethod> = {
  'Kredi Kartı': 'card',
  Nakit: 'cash',
  Online: 'online',
  'Banka Havalesi': 'online'
}

export function mapOrderListItemToOrder(item: OrderListItemResponse): Order {
  return {
    id: item.orderId,
    customerName: item.customerName,
    customerPhone: '', // Backend'den gelmiyor, detay sayfasından alınacak
    customerAddress: '', // Backend'den gelmiyor, detay sayfasından alınacak
    status: item.status as OrderStatusesGroups, // Backend'den direkt OrderStatusesGroups olarak geliyor
    createdAt: item.orderTime,
    updatedAt: item.systemEntryTime,
    totalAmount: item.totalAmount,
    courierInfo: item.carrierName
      ? {
          id: '', // Backend'den gelmiyor
          name: item.carrierName,
          licensePlate: undefined,
          position: [0, 0] // Backend'den gelmiyor
        }
      : undefined,
    restaurant: {
      id: '',
      name: '',
      address: '',
      phone: '',
      isActive: true,
      createdAt: ''
    }, // Backend'den gelmiyor
    paymentMethod: paymentMap[item.paymentType] || 'cash',
    channel: channelMap[item.channel.toLowerCase()] || 'manuel',
    customerPosition: [0, 0] // Backend'den gelmiyor
  }
}

export function mapOrderDetailToOrder(detail: OrderDetailResponse): Order {
  return {
    id: detail.orderId,
    customerName: detail.customerName,
    customerPhone: detail.customerPhone,
    customerAddress: detail.deliveryAddress,
    status: OrderStatusesGroups.CREATED, // Detay'da status yok, varsayılan created
    createdAt: detail.time,
    updatedAt: detail.lastUpdate,
    totalAmount: detail.totalAmount,
    courierInfo: detail.carrier
      ? {
          id: '',
          name: detail.carrier.name || '',
          licensePlate: detail.carrier.plate,
          position:
            detail.carrier.latitude && detail.carrier.longitude
              ? [detail.carrier.latitude, detail.carrier.longitude]
              : [0, 0]
        }
      : undefined,
    restaurant: {
      id: '',
      name: '',
      address: '',
      phone: '',
      isActive: true,
      createdAt: ''
    },
    paymentMethod: paymentMap[detail.paymentMethod] || 'cash',
    channel: channelMap[detail.channel.toLowerCase()] || 'manuel',
    customerPosition: [0, 0]
  }
}

export function mapOrderStatsResponse(stats: OrderStatsResponse) {
  // Created = Total - (Delivered + InProgress + Cancelled)
  const created = Math.max(0, stats.totalOrder - (stats.deliveredOrder + stats.inProgressOrder + stats.cancelOrder))

  return {
    total: stats.totalOrder,
    created,
    shipped: stats.inProgressOrder,
    delivered: stats.deliveredOrder,
    cancelled: stats.cancelOrder
  }
}

export function mapLatestOrderItem(item: LatestOrderItemResponse) {
  return {
    orderId: item.orderId,
    status: item.status as OrderStatusesGroups, // Backend'den direkt OrderStatusesGroups olarak geliyor
    customerName: item.customerName,
    date: item.date,
    totalAmount: item.totalAmount
  }
}
