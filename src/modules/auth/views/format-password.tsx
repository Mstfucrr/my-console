'use client'
import { authService } from '@/modules/auth/service/auth.service'
import { IPasswordRecoveryRequest } from '@/modules/auth/types'
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

  const { mutateAsync: passwordRecover } = useMutation({
    mutationFn: (request: IPasswordRecoveryRequest) => authService.passwordRecovery(request)
  })

  const onEmailSubmit = async (data: EmailFormType) => {
    try {
      const response = await passwordRecover({
        email: data.email,
        turnstileToken: turnstileState.token || undefined
      })

      if (response.requiresAccountId) {
        // Birden fazla hesap bulundu, accountId istenmeli
        setRequiresAccountId(true)
        setEmail(data.email)
        toast.info("Bu email adresine ait birden fazla hesap bulundu. Lütfen hesap ID'nizi giriniz.")
      } else if (response.recoverySessionId) {
        // Tek hesap bulundu, direkt reset-password sayfasına yönlendir
        toast.success('Şifre sıfırlama kodu e-posta adresinize gönderildi.')
        router.push(`/reset-password?recoverySessionId=${response.recoverySessionId}`)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyiniz.')
        return
      }
      console.error('forgot password error', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
  }

  const onAccountIdSubmit = async (data: AccountIdFormType) => {
    try {
      const response = await passwordRecover({
        accountId: data.accountId,
        email: data.email,
        turnstileToken: turnstileState.token || undefined
      })

      if (response.recoverySessionId) {
        toast.success('Şifre sıfırlama kodu e-posta adresinize gönderildi.')
        router.push(`/reset-password?recoverySessionId=${response.recoverySessionId}`)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyiniz.')
        return
      }
      console.error('forgot password error', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
  }

  if (requiresAccountId) {
    return <ForgotPasswordAccountIdStep email={email} onSubmit={onAccountIdSubmit} />
  }

  return <ForgotPasswordEmailStep onSubmit={onEmailSubmit} />
}
