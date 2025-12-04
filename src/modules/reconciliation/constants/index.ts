import { BadgeProps } from '@/components/ui/badge'
import { ReconciliationStatus, ReconciliationStatusType } from '../types'

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
