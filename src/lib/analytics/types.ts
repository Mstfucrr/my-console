import { ReconciliationStatusType } from '@/modules/reconciliation/types'
import type { ANALYTICS_EVENTS, AnalyticsEventName } from './events'

export type EventStatus = 'attempt' | 'success' | 'failed'

export type NormalizedSearch = {
  length: number
  type: 'empty' | 'numeric' | 'text'
}

export type OrdersFiltersAppliedEvent = {
  status: string
  search: NormalizedSearch
}

export type OrderCreateEvent =
  | {
      status: 'attempt' | 'success'
      total_amount: number
      city_name?: string
      county_name?: string
      district_name?: string
      payment_type_name?: string
    }
  | {
      status: 'failed'
      http_status: number | null
      message: string | null
    }

export type PurchaseCompletedEvent = {
  total_amount: number
  city_name?: string
  county_name?: string
  district_name?: string
  payment_type_name?: string
}

export type ReconciliationActionEvent = {
  action: 'approve' | 'report'
  status: EventStatus
  period: string
  record_status: ReconciliationStatusType
}

export type ReportFiltersAppliedEvent = {
  status: string
  payment_method: string
  search: NormalizedSearch
  date_range_days?: number
}

export type UserLoginEvent =
  | {
      status: 'success'
      method: 'password' | 'otp'
      requires_otp: boolean
    }
  | {
      status: 'failed'
      stage: 'login' | 'otp_verify'
      requires_otp: boolean
      http_status: number | null
      message?: string
      email?: string
      accountId?: string
    }

export type UserResendOtpEvent =
  | {
      status: 'success'
    }
  | {
      status: 'failed'
      http_status: number | null
    }

export type UserLogoutEvent = Record<string, never>

export type PasswordChangeEvent =
  | { status: 'success' }
  | { status: 'failed'; http_status: number | null; message: string | null }

export type ApiCallEvent = {
  method?: string
  endpoint?: string
  duration_ms?: number
  http_status?: number
}

export type AnalyticsEventPayloadMap = {
  [ANALYTICS_EVENTS.ordersFiltersApplied]: OrdersFiltersAppliedEvent
  [ANALYTICS_EVENTS.orderCreate]: OrderCreateEvent
  [ANALYTICS_EVENTS.purchaseCompleted]: PurchaseCompletedEvent
  [ANALYTICS_EVENTS.reconciliationAction]: ReconciliationActionEvent
  [ANALYTICS_EVENTS.reportFiltersApplied]: ReportFiltersAppliedEvent
  [ANALYTICS_EVENTS.apiCall]: ApiCallEvent
  [ANALYTICS_EVENTS.userLogin]: UserLoginEvent
  [ANALYTICS_EVENTS.userResendOtp]: UserResendOtpEvent
  [ANALYTICS_EVENTS.userLogout]: UserLogoutEvent
  [ANALYTICS_EVENTS.passwordChange]: PasswordChangeEvent
}

export type AnalyticsEventPayload<E extends AnalyticsEventName> = AnalyticsEventPayloadMap[E]
