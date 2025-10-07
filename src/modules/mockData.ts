import { APILog, DashboardStats, Order, OrderStatus, PaymentMapping, Restaurant, User, Webhook } from '@/modules/types'

// Mock Kullanıcılar
export const mockUser: User = {
  id: '1',
  email: 'demo@restaurant.com',
  name: 'Demo Kullanıcı',
  companyName: 'Demo Restoran',
  role: 'admin'
}

export const mockOnboardingUser: User = {
  id: '2',
  email: 'onboarding@restaurant.com',
  name: 'Yeni Kullanıcı',
  companyName: 'Yeni Restoran',
  role: 'admin',
  needsOnboarding: true
}

// Mock Restoranlar
export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Demo Restoran - Merkez',
    address: 'Atatürk Cad. No:123, Kadıköy/İstanbul',
    phone: '+90 216 123 45 67',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Demo Restoran - Şube 2',
    address: 'Bağdat Cad. No:456, Maltepe/İstanbul',
    phone: '+90 216 987 65 43',
    isActive: true,
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Demo Restoran - Şube 3',
    address: 'İstiklal Cad. No:789, Beyoğlu/İstanbul',
    phone: '+90 212 555 11 22',
    isActive: false,
    createdAt: '2024-03-10T09:15:00Z'
  }
]

// Mock Siparişler
export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerName: 'Ahmet Yılmaz',
    customerPhone: '+90 532 123 45 67',
    customerAddress: 'Acıbadem Mah. Çeçen Sok. No:15 Kadıköy/İstanbul',
    status: 'created',
    createdAt: '2024-01-25T18:30:00Z',
    updatedAt: '2024-01-25T19:15:00Z',
    totalAmount: 85.5,
    restaurant: mockRestaurants[0],
    paymentMethod: 'card',
    integration: 'yemeksepeti',
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Fatma Demir',
    customerPhone: '+90 535 987 65 43',
    customerAddress: 'Fenerbahçe Mah. Fener Kalamış Cad. No:42 Kadıköy/İstanbul',
    paymentMethod: 'cash',
    integration: 'getir',
    status: 'shipped',
    createdAt: '2024-01-25T17:45:00Z',
    updatedAt: '2024-01-25T18:30:00Z',
    totalAmount: 67.25,
    restaurant: mockRestaurants[0],
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-003',
    customerName: 'Mehmet Kaya',
    customerPhone: '+90 538 111 22 33',
    customerAddress: 'Göztepe Mah. Bağdat Cad. No:789 Kadıköy/İstanbul',
    status: 'shipped',
    createdAt: '2024-01-25T19:20:00Z',
    updatedAt: '2024-01-25T19:25:00Z',
    totalAmount: 125.75,
    restaurant: mockRestaurants[1],
    paymentMethod: 'online',
    integration: 'trendyol_go',
    courierInfo: {
      id: 'CUR-002',
      name: 'Serkan Kurye',
      licensePlate: '34 ABC 123',
      position: [40.9923, 29.0234]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-004',
    customerName: 'Ayşe Özdemir',
    customerPhone: '+90 542 789 32 14',
    customerAddress: 'Fenerbahçe Mah. Fener Kalamış Cad. No:58 Kadıköy/İstanbul',
    status: 'shipped',
    createdAt: '2024-01-25T16:30:00Z',
    updatedAt: '2024-01-25T17:45:00Z',
    totalAmount: 78.25,
    restaurant: mockRestaurants[0],
    paymentMethod: 'card',
    integration: 'migros_yemek',
    courierInfo: {
      id: 'CUR-002',
      name: 'Serkan Kurye',
      licensePlate: '34 ABC 123',
      position: [40.9784, 29.0602]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-005',
    customerName: 'Emre Kaya',
    customerPhone: '+90 555 123 98 76',
    customerAddress: 'Kozyatağı Mah. Değirmen Sok. No:23 Kadıköy/İstanbul',
    status: 'created',
    createdAt: '2024-01-25T19:45:00Z',
    updatedAt: '2024-01-25T19:45:00Z',
    totalAmount: 89.5,
    restaurant: mockRestaurants[1],
    paymentMethod: 'cash',
    integration: 'tikla_gelsin',
    courierInfo: {
      id: 'CUR-002',
      name: 'Serkan Kurye',
      licensePlate: '34 ABC 123',
      position: [40.985, 29.045]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-007',
    customerName: 'Can Yılmaz',
    customerPhone: '+90 544 321 65 87',
    customerAddress: 'Erenköy Mah. Bağdat Cad. No:234 Kadıköy/İstanbul',
    status: 'shipped',
    createdAt: '2024-01-25T20:10:00Z',
    updatedAt: '2024-01-25T20:25:00Z',
    totalAmount: 92.75,
    restaurant: mockRestaurants[0],
    paymentMethod: 'card',
    integration: 'yemeksepeti',
    courierInfo: {
      id: 'CUR-002',
      name: 'Serkan Kurye',
      licensePlate: '34 ABC 123',
      position: [40.985, 29.045]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-006',
    customerName: 'Zeynep Arslan',
    customerPhone: '+90 533 456 78 90',
    customerAddress: 'Sahrayıcedit Mah. Söğütlüçeşme Cad. No:67 Kadıköy/İstanbul',
    status: 'cancelled',
    createdAt: '2024-01-25T15:20:00Z',
    updatedAt: '2024-01-25T15:35:00Z',
    totalAmount: 45.0,
    restaurant: mockRestaurants[0],
    paymentMethod: 'online',
    integration: 'manuel',
    courierInfo: {
      id: 'CUR-002',
      name: 'Serkan Kurye',
      licensePlate: '34 ABC 123',
      position: [40.985, 29.045]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-008',
    customerName: 'Ali Demir',
    customerPhone: '+90 555 888 77 66',
    customerAddress: 'Caddebostan Mah. Bağdat Cad. No:111 Kadıköy/İstanbul',
    status: 'shipped',
    createdAt: '2024-01-25T14:10:00Z',
    updatedAt: '2024-01-25T15:30:00Z',
    totalAmount: 156.75,
    restaurant: mockRestaurants[1],
    paymentMethod: 'card',
    integration: 'getir',
    courierInfo: {
      id: 'CUR-002',
      name: 'Serkan Kurye',
      licensePlate: '34 ABC 123',
      position: [40.985, 29.045]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-009',
    customerName: 'Selin Kaya',
    customerPhone: '+90 544 999 88 77',
    customerAddress: 'Suadiye Mah. Plaj Yolu Sok. No:45 Maltepe/İstanbul',
    status: 'delivered',
    createdAt: '2024-01-25T13:45:00Z',
    updatedAt: '2024-01-25T14:50:00Z',
    totalAmount: 67.5,
    restaurant: mockRestaurants[0],
    paymentMethod: 'cash',
    integration: 'yemeksepeti',
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-010',
    customerName: 'Burak Özkan',
    customerPhone: '+90 532 777 66 55',
    customerAddress: 'Feneryolu Mah. Bağdat Cad. No:222 Kadıköy/İstanbul',
    status: 'delivered',
    createdAt: '2024-01-25T12:30:00Z',
    updatedAt: '2024-01-25T12:45:00Z',
    totalAmount: 89.25,
    restaurant: mockRestaurants[1],
    paymentMethod: 'online',
    integration: 'trendyol_go',
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-011',
    customerName: 'Elif Şahin',
    customerPhone: '+90 555 444 33 22',
    customerAddress: 'Koşuyolu Mah. Uzunçayır Cad. No:88 Kadıköy/İstanbul',
    status: 'shipped',
    createdAt: '2024-01-25T11:15:00Z',
    updatedAt: '2024-01-25T12:20:00Z',
    totalAmount: 73.0,
    restaurant: mockRestaurants[0],
    paymentMethod: 'card',
    integration: 'migros_yemek',
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-012',
    customerName: 'Murat Aydın',
    customerPhone: '+90 533 222 11 00',
    customerAddress: 'Hasanpaşa Mah. Fahrettin Kerim Gökay Cad. No:156 Kadıköy/İstanbul',
    status: 'cancelled',
    createdAt: '2024-01-25T10:45:00Z',
    updatedAt: '2024-01-25T11:45:00Z',
    totalAmount: 195.5,
    restaurant: mockRestaurants[1],
    paymentMethod: 'cash',
    integration: 'tikla_gelsin',
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-013',
    customerName: 'Deniz Polat',
    customerPhone: '+90 544 555 66 77',
    customerAddress: 'Erenköy Mah. Bağdat Cad. No:333 Kadıköy/İstanbul',
    status: 'created',
    createdAt: '2024-01-25T09:30:00Z',
    updatedAt: '2024-01-25T09:35:00Z',
    totalAmount: 52.75,
    restaurant: mockRestaurants[0],
    paymentMethod: 'online',
    integration: 'manuel',
    customerPosition: [40.985, 29.045]
  }
]

// Mock API Logları
export const mockAPILogs: APILog[] = [
  {
    id: '1',
    timestamp: '2024-01-25T19:30:00Z',
    endpoint: '/api/orders',
    method: 'POST',
    statusCode: 201,
    responseTime: 245,
    request: '{"customerName":"Ahmet Yılmaz","items":[{"name":"Pizza","quantity":1}]}',
    response: '{"success":true,"orderId":"ORD-2024-001"}'
  },
  {
    id: '2',
    timestamp: '2024-01-25T19:25:00Z',
    endpoint: '/api/orders/ORD-2024-001',
    method: 'GET',
    statusCode: 200,
    responseTime: 123,
    request: '',
    response: '{"id":"ORD-2024-001","status":"shipped"}'
  },
  {
    id: '3',
    timestamp: '2024-01-25T19:20:00Z',
    endpoint: '/api/webhooks',
    method: 'POST',
    statusCode: 400,
    responseTime: 89,
    request: '{"url":"invalid-url","events":["order.created"]}',
    response: '{"error":"Invalid webhook URL format"}'
  }
]

// Mock Webhook'lar
export const mockWebhooks: Webhook[] = [
  {
    id: '1',
    url: 'https://restaurant.com/api/webhooks/fiyuu',
    events: ['order.created', 'order.status_changed'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    lastTriggered: '2024-01-25T19:15:00Z'
  },
  {
    id: '2',
    url: 'https://restaurant.com/api/webhooks/delivery-updates',
    events: ['order.delivered'],
    isActive: true,
    createdAt: '2024-01-20T14:30:00Z',
    lastTriggered: '2024-01-25T18:30:00Z'
  }
]

// Mock Ödeme Tipi Eşleştirmeleri
export const mockPaymentMappings: PaymentMapping[] = [
  {
    id: '1',
    clientValue: 'nakit',
    fiyuuValue: 'cash',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    clientValue: 'kredi_karti',
    fiyuuValue: 'card',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    clientValue: 'online_odeme',
    fiyuuValue: 'online',
    createdAt: '2024-01-15T10:00:00Z'
  }
]

// Mock Dashboard İstatistikleri
export const mockDashboardStats: DashboardStats = {
  todayOrders: 15,
  deliveredOrders: 12,
  onWayOrders: 2,
  cancelledOrders: 1,
  totalRevenue: 3250.75,
  pendingPayments: 1875.4,
  ordersByStatus: [
    { status: 'shipped', count: 12, percentage: 80 },
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
  ]
}

// Sipariş durumu için renkler
export const orderStatusColors: Record<OrderStatus, string> = {
  created: '#FF9800', // Turuncu
  shipped: '#13C2C2', // Cyan
  delivered: '#4CAF50', // Yeşil
  cancelled: '#F44336' // Kırmızı
}
