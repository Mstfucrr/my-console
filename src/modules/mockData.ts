import { Order, OrderStatusesValues, Restaurant } from '@/types'

// Mock Restoranlar
export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Demo Restoran - Merkez',
    address: 'Atatürk Cad. No:123, Kadıköy/İstanbul',
    phone: '216 123 45 67',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Demo Restoran - Şube 2',
    address: 'Bağdat Cad. No:456, Maltepe/İstanbul',
    phone: '216 987 65 43',
    isActive: true,
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Demo Restoran - Şube 3',
    address: 'İstiklal Cad. No:789, Beyoğlu/İstanbul',
    phone: '212 555 11 22',
    isActive: false,
    createdAt: '2024-03-10T09:15:00Z'
  }
]

// Mock Siparişler
export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerName: 'Ahmet Yılmaz',
    customerPhone: '532 123 45 67',
    customerAddress: 'Acıbadem Mah. Çeçen Sok. No:15 Kadıköy/İstanbul',
    status: OrderStatusesValues.WAITING_FOR_CARRIER,
    createdAt: '2024-01-25T18:30:00Z',
    updatedAt: '2024-01-25T19:15:00Z',
    totalAmount: 85.5,
    restaurant: mockRestaurants[0],
    paymentMethod: 'card',
    channel: 'yemeksepeti',
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Fatma Demir',
    customerPhone: '535 987 65 43',
    customerAddress: 'Fenerbahçe Mah. Fener Kalamış Cad. No:42 Kadıköy/İstanbul',
    paymentMethod: 'cash',
    channel: 'getir',
    status: OrderStatusesValues.ASSIGNED,
    createdAt: '2024-01-25T17:45:00Z',
    updatedAt: '2024-01-25T18:30:00Z',
    totalAmount: 67.25,
    restaurant: mockRestaurants[0],
    customerPosition: [40.985, 29.045],
    courierInfo: {
      id: 'CUR-001',
      name: 'Murat Kurye',
      licensePlate: '34 DEF 456',
      position: [40.9923, 29.0234]
    }
  },
  {
    id: 'ORD-2024-003',
    customerName: 'Mehmet Kaya',
    customerPhone: '538 111 22 33',
    customerAddress: 'Göztepe Mah. Bağdat Cad. No:789 Kadıköy/İstanbul',
    status: OrderStatusesValues.ASSIGNED,
    createdAt: '2024-01-25T19:20:00Z',
    updatedAt: '2024-01-25T19:25:00Z',
    totalAmount: 125.75,
    restaurant: mockRestaurants[1],
    paymentMethod: 'online',
    channel: 'trendyolGo',
    courierInfo: {
      id: 'CUR-001',
      name: 'Murat Kurye',
      licensePlate: '34 DEF 456',
      position: [40.9923, 29.0234]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-004',
    customerName: 'Ayşe Özdemir',
    customerPhone: '542 789 32 14',
    customerAddress: 'Fenerbahçe Mah. Fener Kalamış Cad. No:58 Kadıköy/İstanbul',
    status: OrderStatusesValues.ASSIGNED,
    createdAt: '2024-01-25T16:30:00Z',
    updatedAt: '2024-01-25T17:45:00Z',
    totalAmount: 78.25,
    restaurant: mockRestaurants[0],
    paymentMethod: 'card',
    channel: 'migrosYemek',
    courierInfo: {
      id: 'CUR-002',
      name: 'Gökhan Taş',
      licensePlate: '34 GHT 789',
      position: [40.9784, 29.0602]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-005',
    customerName: 'Emre Kaya',
    customerPhone: '555 123 98 76',
    customerAddress: 'Kozyatağı Mah. Değirmen Sok. No:23 Kadıköy/İstanbul',
    status: OrderStatusesValues.WAITING_FOR_CARRIER,
    createdAt: '2024-01-25T19:45:00Z',
    updatedAt: '2024-01-25T19:45:00Z',
    totalAmount: 89.5,
    restaurant: mockRestaurants[1],
    paymentMethod: 'cash',
    channel: 'tiklaGelsin',
    courierInfo: {
      id: 'CUR-003',
      name: 'Ayhan Yıldız',
      licensePlate: '34 AYH 321',
      position: [40.985, 29.045]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-007',
    customerName: 'Can Yılmaz',
    customerPhone: '544 321 65 87',
    customerAddress: 'Erenköy Mah. Bağdat Cad. No:234 Kadıköy/İstanbul',
    status: OrderStatusesValues.ASSIGNED,
    createdAt: '2024-01-25T20:10:00Z',
    updatedAt: '2024-01-25T20:25:00Z',
    totalAmount: 92.75,
    restaurant: mockRestaurants[0],
    paymentMethod: 'card',
    channel: 'yemeksepeti',
    courierInfo: {
      id: 'CUR-004',
      name: 'Berkay Demir',
      licensePlate: '34 BRK 654',
      position: [40.985, 29.045]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-006',
    customerName: 'Zeynep Arslan',
    customerPhone: '533 456 78 90',
    customerAddress: 'Sahrayıcedit Mah. Söğütlüçeşme Cad. No:67 Kadıköy/İstanbul',
    status: OrderStatusesValues.CANCELLED,
    createdAt: '2024-01-25T15:20:00Z',
    updatedAt: '2024-01-25T15:35:00Z',
    totalAmount: 45.0,
    restaurant: mockRestaurants[0],
    paymentMethod: 'online',
    channel: 'fiyuu',
    courierInfo: {
      id: 'CUR-005',
      name: 'Seda Aksoy',
      licensePlate: '34 SDA 987',
      position: [40.985, 29.045]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-008',
    customerName: 'Ali Demir',
    customerPhone: '555 888 77 66',
    customerAddress: 'Caddebostan Mah. Bağdat Cad. No:111 Kadıköy/İstanbul',
    status: OrderStatusesValues.ASSIGNED,
    createdAt: '2024-01-25T14:10:00Z',
    updatedAt: '2024-01-25T15:30:00Z',
    totalAmount: 156.75,
    restaurant: mockRestaurants[1],
    paymentMethod: 'card',
    channel: 'getir',
    courierInfo: {
      id: 'CUR-006',
      name: 'Yusuf Kılıç',
      licensePlate: '34 YSF 852',
      position: [40.985, 29.045]
    },
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-009',
    customerName: 'Selin Kaya',
    customerPhone: '544 999 88 77',
    customerAddress: 'Suadiye Mah. Plaj Yolu Sok. No:45 Maltepe/İstanbul',
    status: OrderStatusesValues.DELIVERED,
    createdAt: '2024-01-25T13:45:00Z',
    updatedAt: '2024-01-25T14:50:00Z',
    totalAmount: 67.5,
    restaurant: mockRestaurants[0],
    paymentMethod: 'cash',
    channel: 'yemeksepeti',
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-010',
    customerName: 'Burak Özkan',
    customerPhone: '532 777 66 55',
    customerAddress: 'Feneryolu Mah. Bağdat Cad. No:222 Kadıköy/İstanbul',
    status: OrderStatusesValues.DELIVERED,
    createdAt: '2024-01-25T12:30:00Z',
    updatedAt: '2024-01-25T12:45:00Z',
    totalAmount: 89.25,
    restaurant: mockRestaurants[1],
    paymentMethod: 'online',
    channel: 'trendyolGo',
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-011',
    customerName: 'Elif Şahin',
    customerPhone: '555 444 33 22',
    customerAddress: 'Koşuyolu Mah. Uzunçayır Cad. No:88 Kadıköy/İstanbul',
    status: OrderStatusesValues.ASSIGNED,
    createdAt: '2024-01-25T11:15:00Z',
    updatedAt: '2024-01-25T12:20:00Z',
    totalAmount: 73.0,
    restaurant: mockRestaurants[0],
    paymentMethod: 'card',
    channel: 'migrosYemek',
    customerPosition: [40.985, 29.045],
    courierInfo: {
      id: 'CUR-007',
      name: 'Selin Kılıç',
      licensePlate: '34 SK 123',
      position: [40.9923, 29.0234]
    }
  },
  {
    id: 'ORD-2024-012',
    customerName: 'Murat Aydın',
    customerPhone: '533 222 11 00',
    customerAddress: 'Hasanpaşa Mah. Fahrettin Kerim Gökay Cad. No:156 Kadıköy/İstanbul',
    status: OrderStatusesValues.CANCELLED,
    createdAt: '2024-01-25T10:45:00Z',
    updatedAt: '2024-01-25T11:45:00Z',
    totalAmount: 195.5,
    restaurant: mockRestaurants[1],
    paymentMethod: 'cash',
    channel: 'tiklaGelsin',
    customerPosition: [40.985, 29.045]
  },
  {
    id: 'ORD-2024-013',
    customerName: 'Deniz Polat',
    customerPhone: '544 555 66 77',
    customerAddress: 'Erenköy Mah. Bağdat Cad. No:333 Kadıköy/İstanbul',
    status: OrderStatusesValues.WAITING_FOR_CARRIER,
    createdAt: '2024-01-25T09:30:00Z',
    updatedAt: '2024-01-25T09:35:00Z',
    totalAmount: 52.75,
    restaurant: mockRestaurants[0],
    paymentMethod: 'online',
    channel: 'fiyuu',
    customerPosition: [40.985, 29.045]
  }
]
