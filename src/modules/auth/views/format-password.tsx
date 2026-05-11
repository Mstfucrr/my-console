'use client'
import { authService } from '@/modules/auth/service/auth.service'
import { IPasswordRecoveryRequest } from '@/modules/auth/types'
import type { AccountType } from '@/types/profile'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTurnstile } from '../hooks/useTurnstile'
import { AccountIdFormType, ForgotPasswordAccountIdStep } from './forgot-password-account-id-step'
import { EmailFormType, ForgotPasswordEmailStep } from './forgot-password-email-step'

export function ForgotPasswordView() {
  const router = useRouter()
  const turnstileState = useTurnstile()
  const [requiresAccountId, setRequiresAccountId] = useState(false)
  const [email, setEmail] = useState('')
  const [recoveryAccountType, setRecoveryAccountType] = useState<AccountType>('store')

  const { mutateAsync: passwordRecover } = useMutation({
    mutationFn: (request: IPasswordRecoveryRequest) => authService.passwordRecovery(request)
  })

  const onEmailSubmit = async (data: EmailFormType) => {
    try {
      const response = await passwordRecover({
        accountType: data.accountType,
        email: data.email,
        turnstileToken: turnstileState.token || undefined
      })

      if (response.requiresAccountId) {
        // Birden fazla hesap bulundu, accountId istenmeli
        turnstileState.resetToken()
        setRequiresAccountId(true)
        setEmail(data.email)
        setRecoveryAccountType(data.accountType)
        toast.info(response.message ?? "Lütfen hesap ID'nizi giriniz.")
      } else if (response.recoverySessionId) {
        // Tek hesap bulundu, direkt reset-password sayfasına yönlendir
        toast.success('Şifre sıfırlama kodu e-posta adresinize gönderildi.')
        router.push(`/reset-password?recoverySessionId=${response.recoverySessionId}`)
      }
    } catch (error) {
      turnstileState.resetToken()
      const axiosError = error as AxiosError<{ message?: string }>
      console.error('forgot password email error', axiosError)
      toast.error(axiosError.response?.data?.message ?? 'Bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
  }

  const onAccountIdSubmit = async (data: AccountIdFormType) => {
    try {
      const response = await passwordRecover({
        accountType: recoveryAccountType,
        accountId: data.accountId,
        email: data.email,
        turnstileToken: turnstileState.token || undefined
      })

      if (response.recoverySessionId) {
        toast.success('Şifre sıfırlama kodu e-posta adresinize gönderildi.')
        router.push(`/reset-password?recoverySessionId=${response.recoverySessionId}`)
      }
    } catch (error) {
      turnstileState.resetToken()
      const axiosError = error as AxiosError<{ message?: string }>
      console.error('forgot password account id error', error)
      toast.error(axiosError.response?.data?.message ?? 'Bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
  }

  if (requiresAccountId) {
    return <ForgotPasswordAccountIdStep email={email} onSubmit={onAccountIdSubmit} turnstileState={turnstileState} />
  }

  return <ForgotPasswordEmailStep onSubmit={onEmailSubmit} turnstileState={turnstileState} />
}
