export interface ILoginRequest {
  email: string
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
  action_cookie: string
}

export interface ISignupRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  city: string
  address: string
}

export interface ISignupResponse {
  cookie: string
}

export interface IForgotPasswordRequest {
  email: string
}

export interface IForgotPasswordResponse {
  success: boolean
  message: string
}

export interface IResetPasswordRequest {
  token: string
  password: string
}

export interface IResetPasswordResponse {
  success: boolean
  message: string
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
    await new Promise(resolve => setTimeout(resolve, 1500))
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
    await new Promise(resolve => setTimeout(resolve, 1500))
    return response.data
  }

  async verifyOtp(request: IVerifyOtpRequest): Promise<IVerifyOtpResponse> {
    console.log('verifyOtp request', request)
    const response = {
      data: {
        isOtpValid: request.otp === '123456' ? true : false,
        action_cookie: '1234567890'
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (!response.data.isOtpValid) {
      throw new Error('Invalid OTP')
    }

    return response.data
  }

  async setCookie(request: ISetCookieRequest): Promise<{ cookie: string }> {
    console.log('setCookie request', request)
    const response = {
      data: {
        cookie: '1234567890'
      }
    }
    localStorage.setItem('token', response.data.cookie)
    await new Promise(resolve => setTimeout(resolve, 1500))

    return response.data
  }

  async signup(request: ISignupRequest): Promise<ISignupResponse> {
    console.log('signup request', request)
    const response = {
      data: {
        cookie: '1234567890',
        otp: true,
        phoneNumber: '1234567890',
        installationId: '1234567890',
        redirectUrl: 'https://fiyuu.com',
        otpTimeout: 60
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1500))
    return response.data
  }

  async forgotPassword(request: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
    console.log('forgotPassword request', request)
    const response = {
      data: {
        success: true,
        message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
    return response.data
  }

  async resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse> {
    console.log('resetPassword request', request)
    const response = {
      data: {
        success: true,
        message: 'Şifreniz başarıyla güncellendi.'
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
    return response.data
  }
}

const authService = new AuthService()

export { authService }
