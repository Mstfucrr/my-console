export interface ILoginRequest {
  identifier: string
  password: string
  fiyuu_cookie?: string
}

export interface ILoginResponse {
  otp: boolean
  phoneNumber: string
  installationId: string
  redirectUrl: string
  otpTimeout: number
}

export interface IVerifyOtpRequest {
  phoneNumber: string
  otp: string
  installationId: string
}

export interface IVerifyOtpResponse {
  isOtpValid: boolean
  action_cookie: string
}

export interface ISetCookieRequest {
  ticket: string
}

class AuthService {
  async getSigninCookie(): Promise<{ cookie: string }> {
    console.log('getSigninCookie request')
    const response = {
      data: {
        cookie: '1234567890'
      }
    }
    console.log('getSigninCookie response', response)
    await new Promise(resolve => setTimeout(resolve, 2500))
    return response.data
  }

  async login(request: ILoginRequest): Promise<ILoginResponse> {
    console.log('login request', request)
    const response = {
      data: {
        otp: true,
        phoneNumber: '1234567890',
        installationId: '1234567890',
        redirectUrl: 'https://fiyuu.com',
        otpTimeout: 60
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2500))
    return response.data
  }

  async verifyOtp(request: IVerifyOtpRequest): Promise<IVerifyOtpResponse> {
    console.log('verifyOtp request', request)
    const response = {
      data: {
        isOtpValid: true,
        action_cookie: '1234567890'
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2500))
    return response.data
  }

  async setCookie(request: ISetCookieRequest): Promise<ILoginResponse> {
    console.log('setCookie request', request)
    const response = {
      data: {
        otp: true,
        phoneNumber: '1234567890',
        installationId: '1234567890',
        redirectUrl: 'https://fiyuu.com',
        otpTimeout: 60
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2500))
    return response.data
  }
}

const authService = new AuthService()

export { authService }
