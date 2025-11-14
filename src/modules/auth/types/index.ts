// Backend LoginDto'ya uygun
export interface ILoginRequest {
  accountId: string
  identifier: string
  password: string
}

// Backend LoginResponse'a uygun
export interface ILoginResponse {
  accessToken: string
  userId: string
  accountId: string
  requiresOtp?: boolean
  otpSessionId?: string
  maskedPhoneNumber?: string
}

// Backend OtpVerifyDto'ya uygun
export interface IVerifyOtpRequest {
  otpSessionId: string
  otpCode: string
}

// Backend OtpVerifyResponse'a uygun
export interface IVerifyOtpResponse {
  accessToken: string
  userId: string
  accountId: string
}

// Backend LogoutDto'ya uygun
export interface ILogoutRequest {
  accessToken: string
}

// Backend RefreshTokenDto'ya uygun
export interface IRefreshTokenRequest {
  refreshToken: string
}

// Backend RefreshTokenResponse'a uygun
export interface IRefreshTokenResponse {
  accessToken: string
  refreshToken?: string
}

// Backend PasswordRecoveryDto'ya uygun
export interface IPasswordRecoveryRequest {
  accountId: string
  email: string
}

// Backend PasswordRecoveryResponse'a uygun
export interface IPasswordRecoveryResponse {
  recoverySessionId: string
  message: string
}

// Backend ConfirmCodeDto'ya uygun
export interface IConfirmCodeRequest {
  recoverySessionId: string
  code: string
  newPassword: string
}

// Backend ConfirmCodeResponse'a uygun
export interface IConfirmCodeResponse {
  message: string
}
