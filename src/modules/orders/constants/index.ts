import { OrderStatusesGroups } from '@/types'

// Completed status groups
const COMPLETED_STATUS_GROUPS = [OrderStatusesGroups.DELIVERED, OrderStatusesGroups.CANCELLED]

// Active status groups
const ACTIVE_STATUS_GROUPS = [OrderStatusesGroups.CREATED, OrderStatusesGroups.SHIPPED]

import { OrderChannel } from '@/types'

const PAYMENT_METHOD_COLORS = {
  cash: 'bg-green-100 text-green-800',
  card: 'bg-blue-100 text-blue-800',
  online: 'bg-purple-100 text-purple-800'
} as const

const CHANNEL_LABELS: Record<OrderChannel, string> = {
  yemeksepeti: 'Yemeksepeti',
  getir: 'Getir',
  trendyolGo: 'Trendyol Go',
  migrosYemek: 'Migros Yemek',
  tiklaGelsin: 'Tıkla Gelsin',
  araGelsin: 'Ara Gelsin',
  fiyuu: 'Fiyuu',
  manuel: 'Manuel',
  Console: 'Console'
} as const

const CHANNEL_COLORS: Record<OrderChannel, string> = {
  yemeksepeti: 'bg-red-100 text-red-800',
  getir: 'bg-purple-100 text-purple-800',
  trendyolGo: 'bg-orange-100 text-orange-800',
  migrosYemek: 'bg-green-100 text-green-800',
  tiklaGelsin: 'bg-blue-100 text-blue-800',
  araGelsin: 'bg-yellow-100 text-yellow-800',
  fiyuu: 'bg-pink-100 text-pink-800',
  manuel: 'bg-gray-100 text-gray-800',
  Console: 'bg-gray-100 text-gray-800'
} as const

const CHANNEL_IMAGES: Record<OrderChannel, string> = {
  yemeksepeti: 'yemeksepeti.png',
  getir: 'getir.png',
  trendyolGo: 'trendyol.png',
  migrosYemek: 'migros.png',
  tiklaGelsin: 'tiklagelsin.png',
  araGelsin: 'aragelsin.png',
  fiyuu: 'fiyuu.png',
  manuel: 'no-channel.png',
  Console: 'fiyuu.png'
} as const

export {
  ACTIVE_STATUS_GROUPS,
  CHANNEL_COLORS,
  CHANNEL_IMAGES,
  CHANNEL_LABELS,
  COMPLETED_STATUS_GROUPS,
  PAYMENT_METHOD_COLORS
}
