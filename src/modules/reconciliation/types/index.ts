export interface ReconciliationRecord {
  id: string
  period: string // Mutabakat Dönemi (1-7 Haziran)
  totalOrderAmount: number // Toplam Sipariş Tutarı
  distributionCount: number // Dağıtım Adedi
  debtBalance: number // Borç Bakiye
  creditBalance: number // Alacak Bakiye
  netAmount: number // Net Tutar
  status: 'pending' | 'approved' | 'problematic' // Durum

  // Detay modal için ek bilgiler
  ataExpressDeliveryInvoice: number // Ata Express Dağıtım Fatura Tutarı
  yourInvoiceAmount: number // Düzenleyeceğiniz Fatura Tutarı
  mealCardAtaCollection: number // Yemek Kartı (Tahsilatı Ata'da)
  mealCardCompanyCollection: number // Yemek Kartı (Tahsilatı Firmanızda)
  onlinePaymentAmount: number // Online Ödeme Tutarı
  restaurantPaymentAmount: number // Restauranta Ödeme Tutarı

  invoiceUploaded?: boolean // Fatura yüklendi mi?
  invoiceUrl?: string // Fatura dosya URL'i
}

export interface ReconciliationStats {
  totalPending: number
  totalApproved: number
  totalFailed: number
  monthlyRevenue: number
  platformFees: number
  netRevenue: number
}

export interface ReconciliationFilterProperties {
  status: 'all' | 'approved' | 'pending' | 'failed'
  month?: string
  year?: string
}
