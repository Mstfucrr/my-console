export interface ReconciliationRecord {
  RecordID: string
  period: string
  totalOrderAmount: number
  distributionCount: number
  totalDeliveryAmount: number
  restaurantPaymentAmount: number
  totalBillAmount: number
  totalFoodCouponAmount: number
  totalPrePaidAmount: number
  totalPrePaidFoodCouponAmount: number
  status: ReconciliationStatusType
  RestaurantTaxNumber: string
  RecordYear: number
  RecordMonth: number
  RecordPeriod: number
  ConfirmID: string
  ConfirmStatus: number
  ConfirmNote: string
  ConfirmDate: string
}

export interface ReconciliationRecordResponse {
  rows: ReconciliationRecord[]
  total: number
}

export enum ReconciliationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  FAILED = 'problematic'
}

export type ReconciliationStatusType =
  | ReconciliationStatus.PENDING
  | ReconciliationStatus.APPROVED
  | ReconciliationStatus.FAILED

export enum ReconciliationConfirmStatus {
  PENDING = 0,
  APPROVED = 1,
  FAILED = 2
}
