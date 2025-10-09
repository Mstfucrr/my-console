import type { ReportsFilterProperties } from '../components/reports-filters'
import type { ReportRecord, ReportsStats } from '../types'

// Mock data for reports
const mockReportsData: ReportRecord[] = [
  {
    id: '7',
    orderId: 'ORD-007',
    customerName: 'Mustafa Özkan',
    customerPhone: '+90 555 789 0123',
    orderDate: '2024-01-09',
    createdDate: '2024-01-09T08:00:00.000Z',
    deliveryDate: '2024-01-10',
    totalAmount: 250.0,
    platformFee: 25.0,
    netAmount: 225.0,
    status: 'delivered',
    paymentMethod: 'Banka Havalesi',
    deliveryAddress: 'Maltepe, İstanbul'
  },
  {
    id: '6',
    orderId: 'ORD-006',
    customerName: 'Zeynep Kaya',
    customerPhone: '+90 555 678 9012',
    orderDate: '2024-01-10',
    createdDate: '2024-01-10T08:00:00.000Z',
    deliveryDate: '2024-01-11',
    totalAmount: 85.0,
    platformFee: 8.5,
    netAmount: 76.5,
    status: 'cancelled',
    paymentMethod: 'Nakit',
    deliveryAddress: 'Beykoz, İstanbul',
    notes: 'Müşteri adres bulamadı'
  },
  {
    id: '5',
    orderId: 'ORD-005',
    customerName: 'Ali Veli',
    customerPhone: '+90 555 567 8901',
    orderDate: '2024-01-11',
    createdDate: '2024-01-11T08:00:00.000Z',
    deliveryDate: '2024-01-12',
    totalAmount: 120.0,
    platformFee: 12.0,
    netAmount: 108.0,
    status: 'delivered',
    paymentMethod: 'Kredi Kartı',
    deliveryAddress: 'Üsküdar, İstanbul'
  },
  {
    id: '4',
    orderId: 'ORD-004',
    customerName: 'Ayşe Özkan',
    customerPhone: '+90 555 456 7890',
    orderDate: '2024-01-12',
    createdDate: '2024-01-12T08:00:00.000Z',
    deliveryDate: '2024-01-13',
    totalAmount: 300.0,
    platformFee: 30.0,
    netAmount: 270.0,
    status: 'cancelled',
    paymentMethod: 'Banka Havalesi',
    deliveryAddress: 'Beyoğlu, İstanbul',
    notes: 'Ürün hasarlı geldi'
  },
  {
    id: '3',
    orderId: 'ORD-003',
    customerName: 'Mehmet Kaya',
    customerPhone: '+90 555 345 6789',
    orderDate: '2024-01-13',
    createdDate: '2024-01-13T08:00:00.000Z',
    deliveryDate: '2024-01-14',
    totalAmount: 75.0,
    platformFee: 7.5,
    netAmount: 67.5,
    status: 'cancelled',
    paymentMethod: 'Kredi Kartı',
    deliveryAddress: 'Şişli, İstanbul',
    notes: 'Müşteri iptal etti'
  },
  {
    id: '2',
    orderId: 'ORD-002',
    customerName: 'Fatma Demir',
    customerPhone: '+90 555 234 5678',
    orderDate: '2024-01-14',
    createdDate: '2024-01-14T08:00:00.000Z',
    deliveryDate: '2024-01-15',
    totalAmount: 200.0,
    platformFee: 20.0,
    netAmount: 180.0,
    status: 'delivered',
    paymentMethod: 'Nakit',
    deliveryAddress: 'Beşiktaş, İstanbul'
  },
  {
    id: '1',
    orderId: 'ORD-001',
    customerName: 'Ahmet Yılmaz',
    customerPhone: '+90 555 123 4567',
    orderDate: '2024-01-15',
    createdDate: '2024-01-15T08:00:00.000Z',
    deliveryDate: '2024-01-16',
    totalAmount: 150.0,
    platformFee: 15.0,
    netAmount: 135.0,
    status: 'delivered',
    paymentMethod: 'Kredi Kartı',
    deliveryAddress: 'Kadıköy, İstanbul',
    notes: 'Hızlı teslimat'
  }
]

export const reportsService = {
  async getReports(filters?: ReportsFilterProperties): Promise<ReportRecord[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    let filteredData = [...mockReportsData]

    // Apply search filter
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filteredData = filteredData.filter(
        item =>
          item.orderId.toLowerCase().includes(search) ||
          item.customerName.toLowerCase().includes(search) ||
          item.customerPhone.includes(search)
      )
    }

    // Apply status filter
    if (filters?.status && filters.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === filters.status)
    }

    // Apply payment method filter
    if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
      filteredData = filteredData.filter(item => item.paymentMethod === filters.paymentMethod)
    }

    // Apply date range filters
    if (filters?.dateFrom) {
      filteredData = filteredData.filter(item => item.orderDate >= filters.dateFrom!)
    }

    if (filters?.dateTo) {
      filteredData = filteredData.filter(item => item.orderDate <= filters.dateTo!)
    }

    return filteredData
  },

  async getReportsStats(filters?: ReportsFilterProperties): Promise<ReportsStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Get filtered data for accurate stats
    const data = await this.getReports(filters)

    return {
      totalOrders: data.length,
      totalRevenue: data.reduce((sum, item) => sum + item.totalAmount, 0),
      totalFees: data.reduce((sum, item) => sum + item.platformFee, 0),
      netRevenue: data.reduce((sum, item) => sum + item.netAmount, 0)
    }
  }
}
