// OTP ile ilgili tipler
export type OtpChannel = 'phone' | 'email'

// API hata kodları (entegrasyon dokümanı)
export type PartnerApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'SESSION_NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_OTP'
  | 'CHANNELS_NOT_VERIFIED'
  | 'TENANT_ALREADY_EXISTS'
  | 'INVALID_TOKEN'
  | 'WEAK_PASSWORD'
  | 'MERCHANT_SERVICE_UNAVAILABLE'

// Başvuru adımı ile ilgili tipler
export interface TenantApplicationRequest {
  firstName: string
  surname: string
  phoneNumber: string
  email: string
  taxNumber: string
  kvkkAccepted?: boolean
  turnstileToken?: string
}

/** 201 — sessionId 30 dk geçerli */
export interface TenantApplicationResponse {
  sessionId: string
}

// OTP gönderme adımı ile ilgili tipler
export interface TenantOtpSendRequest {
  sessionId: string
  channel: OtpChannel
}

export interface TenantOtpSendResponse {
  success: boolean
  channel: OtpChannel
  expiresInSeconds: number
  message: string
}

// OTP doğrulama adımı ile ilgili tipler
export interface TenantOtpVerifyRequest {
  sessionId: string
  channel: OtpChannel
  code: string
}

export interface TenantOtpVerifyResponse {
  success: boolean
  channel: OtpChannel
  verified: boolean
  allChannelsVerified: boolean
}

// Başvurunun tamamlanması adımı ile ilgili tipler
export interface TenantApplicationCompleteRequest {
  sessionId: string
}

export interface TenantApplicationCompleteResponse {
  tenantId: string
  passwordSetupLink: string
  passwordSetupToken: string
  expiresAt: string
}

// Şifre kurulumu — POST /api/tenant-applications/password-setup
export interface TenantPasswordSetupRequest {
  passwordSetupToken: string
  password: string
}

export interface TenantPasswordSetupResponse {
  success: boolean
  message: string
}
