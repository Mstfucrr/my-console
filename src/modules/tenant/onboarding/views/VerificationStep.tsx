'use client'

import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { createEmptyOtp, useOtpInput } from '@/hooks/use-otp-input'
import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import type { OnboardingStepCompletedEvent } from '@/lib/analytics/types'
import { phoneLabel } from '@/lib/phoen-label'
import { useOnboarding } from '@/modules/tenant/onboarding/context/OnboardingContext'
import {
  useCompleteTenantApplicationMutation,
  useSendTenantOtpMutation,
  useVerifyTenantOtpMutation
} from '@/modules/tenant/onboarding/hooks/useTanentMutations'
import { AxiosError } from 'axios'
import { Mail, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { VerificationItem } from '../components/VerificationItem'
import { VerificationOtpModal } from '../components/VerificationOtpModal'

const OTP_LENGTH = 6
const DEFAULT_COOLDOWN_SECONDS = 60

type VerificationType = 'phoneNumber' | 'email'

export function VerificationStep() {
  const {
    contactData,
    applicationSessionId,
    goToContactInformation,
    verifiedSnapshot,
    setVerifiedSnapshot,
    setPasswordSetupToken
  } = useOnboarding()
  const router = useRouter()
  const [activeVerificationType, setActiveVerificationType] = useState<VerificationType | null>(null)
  const [otpValues, setOtpValues] = useState<string[]>(createEmptyOtp(OTP_LENGTH))
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([])
  const { mutateAsync: sendOtp, isPending: isSendingOtp } = useSendTenantOtpMutation()
  const { mutateAsync: verifyTenantOtp, isPending: isVerifyingOtp } = useVerifyTenantOtpMutation()
  const { mutateAsync: completeTenantApplication, isPending: isCompletingApplication } =
    useCompleteTenantApplicationMutation()
  const phoneVerified = verifiedSnapshot?.phoneNumber === contactData?.phoneNumber
  const emailVerified = verifiedSnapshot?.email === contactData?.email

  const channel = useMemo(
    () => (activeVerificationType === 'phoneNumber' ? 'phone' : 'email'),
    [activeVerificationType]
  )

  const openVerifyModal = (type: VerificationType) => {
    if (!applicationSessionId) {
      toast.error('Oturum bulunamadı. Lütfen başvuruyu tekrar başlatın.')
      return
    }
    const isChannelPhone = type === 'phoneNumber'
    setActiveVerificationType(type)
    setOtpValues(createEmptyOtp(OTP_LENGTH))
    toast
      .promise(
        sendOtp({
          sessionId: applicationSessionId,
          channel: isChannelPhone ? 'phone' : 'email'
        }),
        {
          pending: 'Kod gönderiliyor...',
          success: isChannelPhone
            ? 'Doğrulama kodu telefonunuza gönderildi.'
            : 'Doğrulama kodu e-posta adresinize gönderildi.',
          error: {
            render: ({ data }: { data: AxiosError<{ message?: string }> }) =>
              data?.response?.data?.message ?? 'Kod gönderilemedi.'
          }
        }
      )
      .then(res => setRemainingSeconds(res?.expiresInSeconds ?? DEFAULT_COOLDOWN_SECONDS))
      .finally(() => setTimeout(() => otpInputRefs.current[0]?.focus(), 0))
  }

  const handleVerifyOtp = async () => {
    if (
      !contactData ||
      !applicationSessionId ||
      !activeVerificationType ||
      otpValues.some(value => !value) ||
      remainingSeconds <= 0
    )
      return

    try {
      const response = await toast.promise(
        async () =>
          await verifyTenantOtp({
            sessionId: applicationSessionId,
            channel,
            code: otpValues.join('')
          }),
        {
          pending: 'Kod doğrulanıyor...',
          success:
            channel === 'phone' ? 'Telefon numaranız başarıyla doğrulandı.' : 'E-posta adresiniz başarıyla doğrulandı.',
          error: {
            render({ data }: { data: AxiosError<{ message?: string }> }) {
              return data?.response?.data?.message || 'Kod doğrulanamadı. Lütfen tekrar deneyin.'
            }
          }
        }
      )

      if (response.verified) {
        setVerifiedSnapshot(prev => ({
          ...(prev ?? {}),
          [activeVerificationType]: contactData[activeVerificationType]
        }))
      }

      setActiveVerificationType(null)
      setOtpValues(createEmptyOtp(OTP_LENGTH))
    } catch (error) {
      console.error('verify tenant otp error', error)
    }
  }

  const { handleOtpChange, handleOtpPaste, handleOtpKeyDown } = useOtpInput({
    length: OTP_LENGTH,
    values: otpValues,
    setValues: setOtpValues,
    inputRefs: otpInputRefs,
    onEnter: handleVerifyOtp
  })

  useEffect(() => {
    if (!activeVerificationType || remainingSeconds <= 0) return

    const timeout = setTimeout(() => {
      setRemainingSeconds(prev => Math.max(prev - 1, 0))
    }, 1000)

    return () => clearTimeout(timeout)
  }, [activeVerificationType, remainingSeconds])

  const handleResendOtp = () => {
    if (!applicationSessionId || !activeVerificationType || remainingSeconds > 0) return
    toast
      .promise(
        sendOtp({
          sessionId: applicationSessionId,
          channel: activeVerificationType === 'phoneNumber' ? 'phone' : 'email'
        }),
        {
          pending: 'Kod gönderiliyor...',
          success:
            channel === 'phone' ? 'Kod telefonunuza tekrar gönderildi.' : 'Kod e-posta adresinize tekrar gönderildi.',
          error: {
            render: ({ data }: { data: AxiosError<{ message?: string }> }) =>
              data?.response?.data?.message ?? 'Lütfen 60 saniye sonra tekrar deneyiniz.'
          }
        }
      )
      .then(res => {
        setOtpValues(createEmptyOtp(OTP_LENGTH))
        setRemainingSeconds(res?.expiresInSeconds ?? DEFAULT_COOLDOWN_SECONDS)
        setTimeout(() => otpInputRefs.current[0]?.focus(), 0)
      })
  }

  const handleCompleteApplication = async () => {
    if (!applicationSessionId) {
      toast.error('Oturum bulunamadı. Lütfen başvuruyu tekrar başlatın.')
      return
    }

    try {
      const response = await toast.promise(
        async () => await completeTenantApplication({ sessionId: applicationSessionId }),
        {
          pending: 'Başvuru tamamlanıyor...',
          success: 'Başvurunuz başarıyla tamamlandı.',
          error: {
            render({ data }: { data: AxiosError<{ message?: string }> }) {
              return data?.response?.data?.message || 'Başvuru tamamlanamadı. Lütfen tekrar deneyin.'
            }
          }
        }
      )
      setPasswordSetupToken(response.passwordSetupToken)
      track<OnboardingStepCompletedEvent>(ANALYTICS_EVENTS.onboardingStepCompleted, {
        step: 'verification',
        status: 'success'
      })
      router.push(`/onboarding?success=true&token=${response.passwordSetupToken}`)
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; code?: string }>
      console.error('complete tenant application error', axiosError)
      track<OnboardingStepCompletedEvent>(ANALYTICS_EVENTS.onboardingStepCompleted, {
        step: 'verification',
        status: 'failed',
        http_status: axiosError.response?.status ?? null,
        message: axiosError.response?.data?.message ?? null
      })
    }
  }

  if (!contactData) return null

  return (
    <div className='flex flex-col gap-4'>
      <VerificationItem
        Icon={Phone}
        title='Telefon Numaranı Doğrula'
        value={phoneLabel(contactData.phoneNumber)}
        isVerified={phoneVerified}
        onVerify={() => openVerifyModal('phoneNumber')}
      />
      <VerificationItem
        Icon={Mail}
        title='E-posta Doğrula'
        value={contactData.email}
        isVerified={emailVerified}
        onVerify={() => openVerifyModal('email')}
      />
      <div className='flex justify-between gap-3'>
        <Button variant='outline' size='md' onClick={goToContactInformation}>
          Geri Dön
        </Button>
        <LoadingButton
          className='w-full'
          size='md'
          type='button'
          isLoading={isCompletingApplication}
          loadingText='Tamamlanıyor...'
          disabled={!applicationSessionId || !phoneVerified || !emailVerified}
          onClick={handleCompleteApplication}
          data-testid='onboarding-complete-application-button'
        >
          Devam Et
        </LoadingButton>
      </div>
      {activeVerificationType && (
        <VerificationOtpModal
          open={Boolean(activeVerificationType)}
          type={activeVerificationType === 'phoneNumber' ? 'phone' : 'email'}
          value={
            activeVerificationType === 'phoneNumber'
              ? `******${String(contactData[activeVerificationType]).slice(-4)}`
              : contactData[activeVerificationType]
          }
          otpValues={otpValues}
          otpInputRefs={otpInputRefs}
          isVerifying={isVerifyingOtp}
          isSending={isSendingOtp}
          remainingSeconds={remainingSeconds}
          onOpenChange={open => {
            if (!open) {
              setActiveVerificationType(null)
              setOtpValues(createEmptyOtp(OTP_LENGTH))
              setRemainingSeconds(0)
            }
          }}
          onOtpChange={handleOtpChange}
          onOtpPaste={handleOtpPaste}
          onOtpKeyDown={handleOtpKeyDown}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
        />
      )}
    </div>
  )
}
