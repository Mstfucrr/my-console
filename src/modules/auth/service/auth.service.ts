import { privateAxiosInstance, publicAxiosInstance } from '@/lib/axios'
import { getToken, setToken } from '@/lib/local-storage-helper'
import type {
  IConfirmCodeRequest,
  IConfirmCodeResponse,
  ILoginRequest,
  ILoginResponse,
  IPasswordRecoveryRequest,
  IPasswordRecoveryResponse,
  IVerifyOtpRequest,
  IVerifyOtpResponse
} from '@/modules/auth/types'

class AuthService {
  async login(request: ILoginRequest): Promise<ILoginResponse> {
    const { data } = await publicAxiosInstance.post<ILoginResponse>('/auth/login', request)
    if (data.requiresOtp) return data
    setToken({ accessToken: data.accessToken, refreshToken: data.accessToken })

    return data
  }

  async verifyOtp(request: IVerifyOtpRequest): Promise<IVerifyOtpResponse> {
    const { data } = await publicAxiosInstance.post<IVerifyOtpResponse>('/auth/otp-verify', {
      otpSessionId: request.otpSessionId,
      otpCode: request.otpCode
    })

    if (!data.userId) throw new Error('Invalid OTP')

    setToken({ accessToken: data.accessToken, refreshToken: data.accessToken })

    return data
  }

  async logout(): Promise<void> {
    const { accessToken } = getToken()
    await privateAxiosInstance.post('/auth/logout', { accessToken })
  }

  async passwordRecovery(request: IPasswordRecoveryRequest): Promise<IPasswordRecoveryResponse> {
    const { data } = await publicAxiosInstance.post<IPasswordRecoveryResponse>('/auth/password-recovery', request)
    return data
  }

  async confirmCode(request: IConfirmCodeRequest): Promise<IConfirmCodeResponse> {
    const { data } = await publicAxiosInstance.post<IConfirmCodeResponse>('/auth/confirm-code', request)
    return data
  }
}

const authService = new AuthService()

export { authService }
