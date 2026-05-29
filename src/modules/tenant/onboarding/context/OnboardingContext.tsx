'use client'

import {
  defaultOnboardingContactFormValues,
  onboardingContactFormSchema,
  type OnboardingContactFormValues
} from '@/modules/tenant/onboarding/constants'
import { useSubmitTenantApplicationMutation } from '@/modules/tenant/onboarding/hooks/useTanentMutations'
import type { TenantApplicationResponse } from '@/modules/tenant/onboarding/service/tanent.service.type'
import type { OnboardingStep, VerifiedContactSnapshot } from '@/modules/tenant/onboarding/types'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import { useSearchParams } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'react-toastify'

const PASSWORD_SETUP_TOKEN_STORAGE_KEY = 'tenant-onboarding-password-setup-token'

type OnboardingContextValue = {
  onboardingContactForm: UseFormReturn<OnboardingContactFormValues>
  step: OnboardingStep
  setStep: (step: OnboardingStep) => void
  contactData: OnboardingContactFormValues | undefined
  applicationSessionId: string | null
  setApplicationSessionId: (sessionId: string | null) => void
  passwordSetupToken: string | null
  setPasswordSetupToken: (token: string | null) => void
  isContactInformationStepCompleted: boolean
  verifiedSnapshot: VerifiedContactSnapshot | null
  setVerifiedSnapshot: Dispatch<SetStateAction<VerifiedContactSnapshot | null>>
  isRequestingApplicationSession: boolean
  requestApplicationSession: (
    data: OnboardingContactFormValues,
    turnstileToken?: string
  ) => Promise<TenantApplicationResponse | null>
  goToContactInformation: () => void
  goToVerification: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<OnboardingStep>('ContactInformation')
  const [contactData, setContactDataState] = useState<OnboardingContactFormValues | undefined>(undefined)
  const [applicationSessionId, setApplicationSessionId] = useState<string | null>(null)
  const [passwordSetupToken, setPasswordSetupTokenState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const tokenFromSearchParams = new URLSearchParams(window.location.search).get('token')
    if (tokenFromSearchParams) return tokenFromSearchParams
    return sessionStorage.getItem(PASSWORD_SETUP_TOKEN_STORAGE_KEY)
  })
  const [verifiedSnapshot, setVerifiedSnapshot] = useState<VerifiedContactSnapshot | null>(null)
  const { mutateAsync: submitApplication, isPending: isRequestingApplicationSession } =
    useSubmitTenantApplicationMutation()

  const isApplicationCompletedSuccessfully = searchParams.get('success') === 'true'

  const setPasswordSetupToken = useCallback((token: string | null) => {
    setPasswordSetupTokenState(token)

    if (typeof window === 'undefined') return

    if (token) {
      sessionStorage.setItem(PASSWORD_SETUP_TOKEN_STORAGE_KEY, token)
      return
    }

    sessionStorage.removeItem(PASSWORD_SETUP_TOKEN_STORAGE_KEY)
  }, [])

  const onboardingContactForm = useForm<OnboardingContactFormValues>({
    resolver: zodResolver(onboardingContactFormSchema),
    mode: 'onSubmit',
    defaultValues: contactData ?? defaultOnboardingContactFormValues
  })

  const requestApplicationSession = useCallback(
    async (data: OnboardingContactFormValues, turnstileToken?: string) => {
      try {
        const response = await toast.promise(
          async () =>
            await submitApplication({
              ...data,
              kvkkAccepted: undefined,
              phoneNumber: data.phoneNumber,
              turnstileToken: turnstileToken
            }),
          {
            pending: 'Başvuru gönderiliyor...',
            success: 'Başvurunuzu tamamlamak için lütfen telefon ve e-posta doğrulamasını tamamlayınız',
            error: {
              render({ data }: { data: AxiosError<{ message?: string }> }) {
                return data?.response?.data?.message ?? 'İşlem başarısız. Lütfen tekrar deneyin.'
              }
            }
          }
        )

        onboardingContactForm.reset(data)

        setContactDataState(data)
        setApplicationSessionId(response.sessionId)
        setPasswordSetupToken(null)
        setVerifiedSnapshot(null)

        return response
      } catch (error) {
        console.error('request application session error', error)
        return null
      }
    },
    [submitApplication, onboardingContactForm, setPasswordSetupToken]
  )

  const isContactInformationStepCompleted = contactData != null

  const goToContactInformation = useCallback(() => setStep('ContactInformation'), [])
  const goToVerification = useCallback(() => setStep('Verification'), [])

  const resetOnboarding = useCallback(() => {
    setStep('ContactInformation') // ilk step'e dön
    setContactDataState(undefined) // contact data'yı temizle
  }, [])

  useEffect(() => {
    if (!isApplicationCompletedSuccessfully) return
    requestAnimationFrame(resetOnboarding)
  }, [resetOnboarding, isApplicationCompletedSuccessfully])

  useEffect(() => {
    const tokenFromSearchParams = searchParams.get('token')
    if (!tokenFromSearchParams || typeof window === 'undefined') return

    sessionStorage.setItem(PASSWORD_SETUP_TOKEN_STORAGE_KEY, tokenFromSearchParams)

    if (tokenFromSearchParams !== passwordSetupToken) {
      requestAnimationFrame(() => setPasswordSetupTokenState(tokenFromSearchParams))
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('token')
    const nextUrl = nextParams.toString()
      ? `${window.location.pathname}?${nextParams.toString()}`
      : window.location.pathname
    window.history.replaceState(window.history.state, '', nextUrl)
  }, [passwordSetupToken, searchParams])

  const value = useMemo<OnboardingContextValue>(
    () => ({
      onboardingContactForm,
      step,
      setStep,
      contactData,
      applicationSessionId,
      setApplicationSessionId,
      passwordSetupToken,
      setPasswordSetupToken,
      isContactInformationStepCompleted,
      verifiedSnapshot,
      setVerifiedSnapshot,
      isRequestingApplicationSession,
      requestApplicationSession,
      goToContactInformation,
      goToVerification
    }),
    [
      onboardingContactForm,
      step,
      contactData,
      applicationSessionId,
      setApplicationSessionId,
      passwordSetupToken,
      setPasswordSetupToken,
      isContactInformationStepCompleted,
      verifiedSnapshot,
      isRequestingApplicationSession,
      requestApplicationSession,
      goToContactInformation,
      goToVerification
    ]
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return ctx
}
