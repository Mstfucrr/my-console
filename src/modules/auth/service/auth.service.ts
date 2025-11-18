import { privateAxiosInstance, publicAxiosInstance } from '@/lib/axios'
import { getToken, setToken } from '@/lib/local-storage-helper'
import type {
  IConfirmCodeRequest,
  IConfirmCodeResponse,
  ILoginRequest,
  ILoginResponse,
  IPasswordRecoveryRequest,
  IPasswordRecoveryResponse,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
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

  async refreshToken(request: IRefreshTokenRequest): Promise<IRefreshTokenResponse> {
    // const { data } = await publicAxiosInstance.post<IRefreshTokenResponse>('/auth/refresh', request)
    // return data
    console.log('refreshToken request', request)
    return {
      accessToken: '1234567890',
      refreshToken: '1234567890'
    }
  }

  async passwordRecovery(request: IPasswordRecoveryRequest): Promise<IPasswordRecoveryResponse> {
    const { data } = await publicAxiosInstance.post<IPasswordRecoveryResponse>('/auth/password-recovery', request)
    console.log('passwordRecovery response', data)
    return data
    console.log('passwordRecovery request', request)
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      recoverySessionId: 'recovery-session-123456',
      message: 'Recovery code sent to your email'
    }
  }

  async confirmCode(request: IConfirmCodeRequest): Promise<IConfirmCodeResponse> {
    const { data } = await publicAxiosInstance.post<IConfirmCodeResponse>('/auth/confirm-code', request)
    console.log('confirmCode response', data)
    return data
    // console.log('confirmCode request', request)
    // await new Promise(resolve => setTimeout(resolve, 2000))

    // // Mock validation
    // if (request.code !== '123456') {
    //   throw new Error('Invalid recovery code')
    // }

    return {
      message: 'Password updated successfully'
    }
  }
}

const authService = new AuthService()

export { authService }
