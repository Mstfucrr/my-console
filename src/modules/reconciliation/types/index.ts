export interface ReconciliationRecord {
  id?: string // For table component compatibility (mapped from RecordID)
  RecordID: string
  RecordYear: number
  RecordMonth: number
  RecordPeriod: number
  RecordPeriodName: string
  RestaurantId: string
  RestaurantName: string
  OrderCount: number
  TotalAmount: number
  TotalPrePaidAmount: number
  TotalDeliveryAmount: number
  RestaurantPaymentAmount: number
  OpenOrderCount: number
  OpenOrderTotalAmount: number
  CalculatedByTypeID: number
  IsUpdated: boolean
  CreateDate: string
  TotalBillAmount: number
  CancelCount: number
  TotalCancelAmount: number
  TotalAmountWithCarrier: number
  Statu: number
  TotalFoodCouponAmount: number
  RestaurantSCode: string
  RestaurantAccountingTitle: string
  RestaurantBrandName: string
  RestaurantAccountingMaturity: string
  TotalTurnover: number
  TotalPrePaidFoodCouponAmount: number
  RestaurantTaxNumber: string
  IsInvoicePurchase: number
  IsInvoiceRestaurantSales: number
  IsInvoiceRestaurantReceipt: number
  InvoicePurchaseDate: string
  InvoiceRestaurantSalesDate: string
  InvoiceRestaurantReceiptDate: null
  RestaurantType: number
  CancelAmountDiscounted: number
  FiyuuCommissionAmountWithoutCancel: number
  ChannelCommissionAmount: number
  CommissionDetails: null
  ConfirmID: string
  ConfirmStatus: ReconciliationConfirmStatus
  ConfirmNote: string
  ConfirmDate: string
}

export interface ReconciliationRecordResponse {
  rows: ReconciliationRecord[]
}

export enum ReconciliationConfirmStatus {
  PENDING = 0,
  APPROVED = 1,
  FAILED = 2
}

export const STATUS_TEXT: Record<ReconciliationConfirmStatus, string> = {
  [ReconciliationConfirmStatus.PENDING]: 'Beklemede',
  [ReconciliationConfirmStatus.FAILED]: 'Onaylanmadı',
  [ReconciliationConfirmStatus.APPROVED]: 'Onaylandı'
} as const

export interface ReconciliationFilterProperties {
  status?: ReconciliationConfirmStatus | 'all'
}
