import { BadgeProps } from '@/components/ui/badge'

export interface ReconciliationRecord {
  RecordID: string
  period: string
  totalOrderAmount: number
  distributionCount: number
  totalDeliveryAmount: number
  restaurantPaymentAmount: number
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

export const STATUS_TEXT: Record<ReconciliationStatus, string> = {
  [ReconciliationStatus.PENDING]: 'Beklemede',
  [ReconciliationStatus.FAILED]: 'Onaylanmadı',
  [ReconciliationStatus.APPROVED]: 'Onaylandı'
} as const

export const STATUS_COLORS: Record<ReconciliationStatusType, BadgeProps['color']> = {
  [ReconciliationStatus.PENDING]: 'warning',
  [ReconciliationStatus.FAILED]: 'destructive',
  [ReconciliationStatus.APPROVED]: 'success'
} as const
