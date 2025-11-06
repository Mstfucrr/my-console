import type { ReconciliationRecord, ReconciliationStats } from '../types'

export const mockReconciliationData: ReconciliationRecord[] = [
  {
    id: 'MUT-2024-001',
    period: '1-7 Haziran 2024',
    totalOrderAmount: 15750.5,
    distributionCount: 186,
    debtBalance: 750.0,
    creditBalance: 1200.0,
    netAmount: 14300.5,
    status: 'completed',
    ataExpressDeliveryInvoice: 930.0,
    yourInvoiceAmount: 15750.5,
    mealCardAtaCollection: 4200.0,
    mealCardCompanyCollection: 2800.0,
    onlinePaymentAmount: 8750.5,
    restaurantPaymentAmount: 14300.5,
    invoiceUploaded: true,
    invoiceUrl: '/invoices/mut-2024-001.pdf'
  },
  {
    id: 'MUT-2024-002',
    period: '8-15 Haziran 2024',
    totalOrderAmount: 22100.75,
    distributionCount: 267,
    debtBalance: 1100.25,
    creditBalance: 850.0,
    netAmount: 20850.5,
    status: 'approved',
    ataExpressDeliveryInvoice: 1335.0,
    yourInvoiceAmount: 22100.75,
    mealCardAtaCollection: 6300.0,
    mealCardCompanyCollection: 4200.0,
    onlinePaymentAmount: 11600.75,
    restaurantPaymentAmount: 20850.5,
    invoiceUploaded: true,
    invoiceUrl: '/invoices/mut-2024-002.pdf'
  },
  {
    id: 'MUT-2024-003',
    period: '16-23 Haziran 2024',
    totalOrderAmount: 18950.25,
    distributionCount: 224,
    debtBalance: 950.25,
    creditBalance: 1150.0,
    netAmount: 18150.0,
    status: 'pending',
    ataExpressDeliveryInvoice: 1120.0,
    yourInvoiceAmount: 18950.25,
    mealCardAtaCollection: 5700.0,
    mealCardCompanyCollection: 3800.0,
    onlinePaymentAmount: 9450.25,
    restaurantPaymentAmount: 18150.0,
    invoiceUploaded: false
  },
  {
    id: 'MUT-2024-004',
    period: '24-30 Haziran 2024',
    totalOrderAmount: 16800.0,
    distributionCount: 198,
    debtBalance: 800.0,
    creditBalance: 950.0,
    netAmount: 16650.0,
    status: 'problematic',
    ataExpressDeliveryInvoice: 990.0,
    yourInvoiceAmount: 16800.0,
    mealCardAtaCollection: 5040.0,
    mealCardCompanyCollection: 3360.0,
    onlinePaymentAmount: 8400.0,
    restaurantPaymentAmount: 16650.0,
    invoiceUploaded: false
  }
]

export const mockStats: ReconciliationStats = {
  totalSettled: 4931.4,
  totalPending: 2969.13,
  totalFailed: 178182,
  monthlyRevenue: 15420.95,
  platformFees: 771.05,
  netRevenue: 14649.9
}
