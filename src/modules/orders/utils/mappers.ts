import type { Order, OrderChannel } from '@/types'
import { OrderStatusesGroups } from '@/types'
import type {
  LatestOrderItemResponse,
  OrderDetailResponse,
  OrderListItemResponse,
  OrderStatsResponse
} from '../types/api'

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
    paymentMethod: item.paymentType,
    channel: item.channel as OrderChannel,
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
    paymentMethod: detail.paymentMethod,
    channel: detail.channel as OrderChannel,
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
