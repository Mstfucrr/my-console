import { APILog, DashboardStats, Order, OrderStatus, PaymentMapping, Restaurant, User, Webhook } from './types'

// Mock Kullanıcı
export const mockUser: User = {
  id: '1',
  email: 'demo@restaurant.com',
  name: 'Demo Kullanıcı',
  companyName: 'Demo Restoran',
  role: 'admin'
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
    status: 'on_way',
    createdAt: '2024-01-25T18:30:00Z',
    updatedAt: '2024-01-25T19:15:00Z',
    totalAmount: 85.5,
    restaurant: mockRestaurants[0],
    items: [
      { id: '1', name: 'Margarita Pizza', quantity: 1, price: 45.0 },
      { id: '2', name: 'Coca Cola 330ml', quantity: 2, price: 12.5 },
      { id: '3', name: 'Patates Kızartması', quantity: 1, price: 15.5 }
    ],
    courierLocation: {
      latitude: 40.9923,
      longitude: 29.0244,
      lastUpdated: '2024-01-25T19:14:30Z'
    },
    logs: [
      {
        id: '1',
        orderId: 'ORD-2024-001',
        status: 'pending',
        message: 'Sipariş alındı',
        timestamp: '2024-01-25T18:30:00Z'
      },
      {
        id: '2',
        orderId: 'ORD-2024-001',
        status: 'preparing',
        message: 'Sipariş hazırlanmaya başlandı',
        timestamp: '2024-01-25T18:35:00Z'
      },
      {
        id: '3',
        orderId: 'ORD-2024-001',
        status: 'ready',
        message: 'Sipariş hazır',
        timestamp: '2024-01-25T19:00:00Z'
      },
      {
        id: '4',
        orderId: 'ORD-2024-001',
        status: 'picked_up',
        message: 'Kurye siparişi aldı',
        timestamp: '2024-01-25T19:10:00Z'
      },
      {
        id: '5',
        orderId: 'ORD-2024-001',
        status: 'on_way',
        message: 'Kurye yola çıktı',
        timestamp: '2024-01-25T19:15:00Z'
      }
    ]
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Fatma Demir',
    customerPhone: '+90 535 987 65 43',
    customerAddress: 'Fenerbahçe Mah. Fener Kalamış Cad. No:42 Kadıköy/İstanbul',
    status: 'delivered',
    createdAt: '2024-01-25T17:45:00Z',
    updatedAt: '2024-01-25T18:30:00Z',
    totalAmount: 67.25,
    restaurant: mockRestaurants[0],
    items: [
      { id: '4', name: 'Tavuk Şiş', quantity: 1, price: 42.0 },
      { id: '5', name: 'Ayran', quantity: 1, price: 8.0 },
      { id: '6', name: 'Salata', quantity: 1, price: 17.25 }
    ],
    logs: [
      {
        id: '6',
        orderId: 'ORD-2024-002',
        status: 'pending',
        message: 'Sipariş alındı',
        timestamp: '2024-01-25T17:45:00Z'
      },
      {
        id: '7',
        orderId: 'ORD-2024-002',
        status: 'preparing',
        message: 'Sipariş hazırlanmaya başlandı',
        timestamp: '2024-01-25T17:50:00Z'
      },
      {
        id: '8',
        orderId: 'ORD-2024-002',
        status: 'ready',
        message: 'Sipariş hazır',
        timestamp: '2024-01-25T18:05:00Z'
      },
      {
        id: '9',
        orderId: 'ORD-2024-002',
        status: 'picked_up',
        message: 'Kurye siparişi aldı',
        timestamp: '2024-01-25T18:10:00Z'
      },
      {
        id: '10',
        orderId: 'ORD-2024-002',
        status: 'on_way',
        message: 'Kurye yola çıktı',
        timestamp: '2024-01-25T18:15:00Z'
      },
      {
        id: '11',
        orderId: 'ORD-2024-002',
        status: 'delivered',
        message: 'Sipariş teslim edildi',
        timestamp: '2024-01-25T18:30:00Z'
      }
    ]
  },
  {
    id: 'ORD-2024-003',
    customerName: 'Mehmet Kaya',
    customerPhone: '+90 538 111 22 33',
    customerAddress: 'Göztepe Mah. Bağdat Cad. No:789 Kadıköy/İstanbul',
    status: 'preparing',
    createdAt: '2024-01-25T19:20:00Z',
    updatedAt: '2024-01-25T19:25:00Z',
    totalAmount: 125.75,
    restaurant: mockRestaurants[1],
    items: [
      { id: '7', name: 'Karışık Izgara', quantity: 2, price: 55.0 },
      { id: '8', name: 'Fanta 330ml', quantity: 2, price: 12.5 },
      { id: '9', name: 'Mercimek Çorbası', quantity: 1, price: 15.75 }
    ],
    logs: [
      {
        id: '12',
        orderId: 'ORD-2024-003',
        status: 'pending',
        message: 'Sipariş alındı',
        timestamp: '2024-01-25T19:20:00Z'
      },
      {
        id: '13',
        orderId: 'ORD-2024-003',
        status: 'preparing',
        message: 'Sipariş hazırlanmaya başlandı',
        timestamp: '2024-01-25T19:25:00Z'
      }
    ]
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
    response: '{"id":"ORD-2024-001","status":"on_way"}'
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
  ordersByStatus: [
    { status: 'delivered', count: 12, percentage: 80 },
    { status: 'on_way', count: 2, percentage: 13.3 },
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
  ]
}

// Sipariş durumu için Türkçe etiketler
export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Beklemede',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  picked_up: 'Kurye Aldı',
  on_way: 'Yolda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi'
}

// Sipariş durumu için renkler
export const orderStatusColors: Record<OrderStatus, string> = {
  pending: '#FF9800', // Turuncu
  preparing: '#2196F3', // Mavi
  ready: '#4CAF50', // Yeşil
  picked_up: '#9C27B0', // Mor
  on_way: '#FF5722', // Kırmızı-turuncu
  delivered: '#4CAF50', // Yeşil
  cancelled: '#F44336' // Kırmızı
}
