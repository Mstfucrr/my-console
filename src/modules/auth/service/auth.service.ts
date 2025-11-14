import { setToken } from '@/lib/local-storage-helper'
import type {
  IConfirmCodeRequest,
  IConfirmCodeResponse,
  ILoginRequest,
  ILoginResponse,
  ILogoutRequest,
  IPasswordRecoveryRequest,
  IPasswordRecoveryResponse,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
  IVerifyOtpRequest,
  IVerifyOtpResponse
} from '@/modules/auth/types'

class AuthService {
  async login(request: ILoginRequest): Promise<ILoginResponse> {
    // const { data } = await publicAxiosInstance.post<ILoginResponse>('/auth/login', request)
    // return data
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('login request', request)
    const response = {
      accessToken: '1234567890',
      userId: '1234567890',
      accountId: '1234567890',
      requiresOtp: true,
      otpSessionId: '1234567890',
      maskedPhoneNumber: '*** *** 1234'
    }

    if (response.requiresOtp) return response

    setToken({ accessToken: response.accessToken, refreshToken: response.accessToken })

    return response
  }

  async verifyOtp(request: IVerifyOtpRequest): Promise<IVerifyOtpResponse> {
    // const { data } = await publicAxiosInstance.post<IVerifyOtpResponse>('/auth/otp-verify', {
    //   otpSessionId: request.otpSessionId,
    //   otpCode: request.otpCode
    // })
    // return data
    console.log('verifyOtp request', request)
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (request.otpCode !== '123456') throw new Error('Invalid OTP')
    const response = {
      accessToken: '1234567890',
      userId: '1234567890',
      accountId: '1234567890'
    }

    setToken({ accessToken: response.accessToken, refreshToken: response.accessToken })

    return response
  }

  async logout(request: ILogoutRequest): Promise<void> {
    // await privateAxiosInstance.post('/auth/logout', request)
    console.log('logout request', request)
    return
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
    // const { data } = await publicAxiosInstance.post('/auth/password-recovery', request)
    // return data
    console.log('passwordRecovery request', request)
    return {
      recoverySessionId: '1234567890',
      message: '1234567890'
    }
  }

  async confirmCode(request: IConfirmCodeRequest): Promise<IConfirmCodeResponse> {
    // const { data } = await publicAxiosInstance.post('/auth/confirm-code', request)
    // return data
    console.log('confirmCode request', request)
    return {
      message: '1234567890'
    }
  }
}

const authService = new AuthService()

export { authService }
