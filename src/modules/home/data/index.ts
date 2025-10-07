import { mockOrders } from '@/modules/mockData'
import { Bike, CheckCircle2, ShoppingCart, XCircle } from 'lucide-react'
import type { DashboardStats, Stats } from '../types'

export const mockDashboardStats: DashboardStats = {
  todayOrders: 15,
  deliveredOrders: 12,
  onWayOrders: 2,
  cancelledOrders: 1,
  totalRevenue: 3250.75,
  pendingPayments: 1875.4,
  ordersByStatus: [
    { status: 'delivered', count: 12, percentage: 80 },
    { status: 'shipped', count: 2, percentage: 13.3 },
    { status: 'cancelled', count: 1, percentage: 6.7 }
  ],
  recentApiErrors: [
    {
      id: '1',
      timestamp: '2024-01-25T19:20:00Z',
      endpoint: '/api/webhooks',
      statusCode: 400,
      errorMessage: 'Invalid webhook URL format',
      request: '{"url":"invalid-url"}',
      response: '{"error":"Invalid webhook URL format"}'
    }
  ],
  recentOrders: mockOrders.slice(0, 2),
  hourlyOrdersChart: [
    { label: '09:00', value: 2 },
    { label: '10:00', value: 5 },
    { label: '11:00', value: 8 },
    { label: '12:00', value: 12 },
    { label: '13:00', value: 15 },
    { label: '14:00', value: 10 },
    { label: '15:00', value: 7 },
    { label: '16:00', value: 9 }
  ],
  hourlyRevenueChart: [
    { label: '09:00', value: 125.5 },
    { label: '10:00', value: 320.75 },
    { label: '11:00', value: 450.25 },
    { label: '12:00', value: 680.9 },
    { label: '13:00', value: 850.4 },
    { label: '14:00', value: 520.65 },
    { label: '15:00', value: 380.3 },
    { label: '16:00', value: 475.85 }
  ],
  averageDeliveryTimeChart: [
    { label: '09:00', value: 45 },
    { label: '10:00', value: 38 },
    { label: '11:00', value: 42 },
    { label: '12:00', value: 35 },
    { label: '13:00', value: 48 },
    { label: '14:00', value: 52 },
    { label: '15:00', value: 41 },
    { label: '16:00', value: 39 }
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
    Icon: Bike,
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
