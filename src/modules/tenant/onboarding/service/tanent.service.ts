import { publicAxiosInstance } from '@/lib/axios'
import type {
  TenantApplicationCompleteRequest,
  TenantApplicationCompleteResponse,
  TenantApplicationRequest,
  TenantApplicationResponse,
  TenantOtpSendRequest,
  TenantOtpSendResponse,
  TenantOtpVerifyRequest,
  TenantOtpVerifyResponse,
  TenantPasswordSetupRequest,
  TenantPasswordSetupResponse
} from './tanent.service.type'

class TanentService {
  async submitApplication(request: TenantApplicationRequest): Promise<TenantApplicationResponse> {
    const { data } = await publicAxiosInstance.post<TenantApplicationResponse>('merchant', request)
    return data
  }

  async sendOtp(request: TenantOtpSendRequest): Promise<TenantOtpSendResponse> {
    const { data } = await publicAxiosInstance.post<TenantOtpSendResponse>('merchant/otp/send', request)
    return data
  }

  async verifyOtp(request: TenantOtpVerifyRequest): Promise<TenantOtpVerifyResponse> {
    const { data } = await publicAxiosInstance.post<TenantOtpVerifyResponse>('merchant/otp/verify', request)
    return data
  }

  async completeApplication(request: TenantApplicationCompleteRequest): Promise<TenantApplicationCompleteResponse> {
    const { data } = await publicAxiosInstance.post<TenantApplicationCompleteResponse>('merchant/complete', request)
    return data
  }

  async setupPassword(request: TenantPasswordSetupRequest): Promise<TenantPasswordSetupResponse> {
    const { data } = await publicAxiosInstance.post<TenantPasswordSetupResponse>('merchant/password-setup', request)
    return data
  }
}

export const tanentService = new TanentService()
