'use client'
import {
  authService,
  ILoginRequest,
  ILoginResponse,
  ISetCookieRequest,
  IVerifyOtpRequest,
  IVerifyOtpResponse
} from '@/modules/auth/service/auth.service'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { createContext, useContext, useState } from 'react'

interface IAuthContext {
  isOtp: boolean
  loginMutation: UseMutationResult<ILoginResponse, Error, ILoginRequest>
  verifyOtpMutation: UseMutationResult<IVerifyOtpResponse, Error, IVerifyOtpRequest>
  setCookieMutation: UseMutationResult<{ cookie: string }, Error, ISetCookieRequest>
  handleOtp: () => void
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOtp, setIsOtp] = useState(false)

  const handleOtp = () => setIsOtp(true)

  const loginMutation = useMutation({
    mutationFn: authService.login
  })

  const verifyOtpMutation = useMutation({
    mutationFn: authService.verifyOtp
  })

  const setCookieMutation = useMutation({
    mutationFn: authService.setCookie
  })

  return (
    <AuthContext.Provider value={{ isOtp, loginMutation, verifyOtpMutation, setCookieMutation, handleOtp }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider')
  }
  return context
}

export { AuthContext, AuthProvider, useAuthContext }
