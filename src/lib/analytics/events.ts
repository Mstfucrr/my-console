'use client'

export const ANALYTICS_EVENTS = {
  // Navigation & usage
  // Orders
  ordersFiltersApplied: 'orders_filters_applied',
  orderCreate: 'order_create',
  purchaseCompleted: 'purchase_completed',
  // Reconciliation
  reconciliationAction: 'reconciliation_action',

  // Reports
  reportFiltersApplied: 'report_filters_applied',

  // Infra / API
  apiCall: 'api_call',

  // Auth
  userLogin: 'user_login',
  userResendOtp: 'user_resend_otp',
  userLogout: 'user_logout',
  passwordChange: 'password_change'
} as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

// Payload types (see `src/lib/analytics/types.ts`)
export type { AnalyticsEventPayload, AnalyticsEventPayloadMap } from './types'
