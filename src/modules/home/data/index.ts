import { Car, CheckCircle2, ShoppingCart, XCircle } from 'lucide-react'
import type { DashboardStats, Stats } from '../types'

export const dashboardMockData: DashboardStats = {
  todayOrders: 120,
  deliveredOrders: 72,
  onWayOrders: 18,
  cancelledOrders: 6,
  ordersByStatus: [
    { status: 'delivered', count: 72, percentage: (72 / 120) * 100 },
    { status: 'on_way', count: 18, percentage: (18 / 120) * 100 },
    { status: 'cancelled', count: 6, percentage: (6 / 120) * 100 },
    { status: 'preparing', count: 12, percentage: (12 / 120) * 100 },
    { status: 'ready', count: 7, percentage: (7 / 120) * 100 },
    { status: 'pending', count: 5, percentage: (5 / 120) * 100 }
  ],
  recentApiErrors: [
    {
      id: '1',
      endpoint: '/api/orders',
      errorMessage: 'Timeout while fetching orders',
      timestamp: new Date().toISOString(),
      statusCode: 504
    },
    {
      id: '2',
      endpoint: '/api/restaurants',
      errorMessage: 'Unauthorized access token',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      statusCode: 401
    }
  ]
}

export const dashboardStats: Stats[] = [
  {
    title: 'Toplam Sipariş',
    value: 120,
    Icon: ShoppingCart,
    color: 'text-blue-600',
    hint: 'Bugün alınan sipariş sayısı'
  },
  {
    title: 'Teslim Edildi',
    value: 72,
    Icon: CheckCircle2,
    color: 'text-green-600',
    hint: 'Başarıyla teslim edilen'
  },
  {
    title: 'Yolda',
    value: 18,
    Icon: Car,
    color: 'text-amber-500',
    hint: 'Şu anda kurye ile'
  },
  {
    title: 'İptal Edildi',
    value: 6,
    Icon: XCircle,
    color: 'text-red-600',
    hint: 'İptal edilen siparişler'
  }
]
