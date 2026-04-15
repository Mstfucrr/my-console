'use client'

import { useProfile } from '@/context/ProfileProvider'
import {
  defaultWelcomeFinancialValues,
  welcomeFinancialFormSchema,
  type WelcomeFinancialFormValues
} from '@/modules/welcome/schemas/welcome-financial-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { WelcomeOnboardingStep } from '../constants'
import { financeService } from '../service/finance.service'
import { SaveFinancialDetailsRequest, WelcomeDocType } from '../types'

export type WelcomeOnboardingContextValue = {
  step: WelcomeOnboardingStep
  setStep: React.Dispatch<React.SetStateAction<WelcomeOnboardingStep>>
  goNext: () => void
  goBack: () => void
  goToFinancialStep: () => void
  showFourthStepperItem: boolean
  form: UseFormReturn<WelcomeFinancialFormValues>
  taxNumberDisplay: string | undefined
  onFinancialSubmit: (data: WelcomeFinancialFormValues) => void
  onFinancialCancel: () => void
  uploadFinancialDocument: (data: { file: File; docType: WelcomeDocType }) => Promise<string>
  isCreatingFinance: boolean
}

const WelcomeOnboardingContext = createContext<WelcomeOnboardingContextValue | null>(null)

export function useWelcomeOnboarding() {
  const ctx = useContext(WelcomeOnboardingContext)
  if (!ctx) {
    throw new Error('useWelcomeOnboarding must be used within WelcomeOnboardingProvider')
  }
  return ctx
}

export function WelcomeOnboardingProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile()
  const [step, setStep] = useState(WelcomeOnboardingStep.Intro)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync: createFinance, isPending: isCreatingFinance } = useMutation({
    mutationFn: (data: SaveFinancialDetailsRequest) => financeService.createFinance(data)
  })

  const { mutateAsync: uploadFinancialDocument } = useMutation({
    mutationFn: ({ file, docType }: { file: File; docType: WelcomeDocType }) =>
      financeService.uploadDocument(file, docType)
  })

  const form = useForm<WelcomeFinancialFormValues>({
    resolver: zodResolver(welcomeFinancialFormSchema),
    defaultValues: defaultWelcomeFinancialValues
  })

  const goNext = useCallback(() => {
    setStep(s => Math.min(s + 1, WelcomeOnboardingStep.Application))
  }, [])

  const goBack = useCallback(() => {
    setStep(s => Math.max(s - 1, WelcomeOnboardingStep.Intro))
  }, [])

  const goToFinancialStep = useCallback(() => {
    setStep(WelcomeOnboardingStep.Financial)
  }, [])

  const onFinancialCancel = useCallback(() => {
    setStep(WelcomeOnboardingStep.Application)
  }, [])

  const onFinancialSubmit = useCallback(
    (data: WelcomeFinancialFormValues) => {
      // Gerçek uygulamada API çağrısı
      console.log('Welcome financial form submitted:', data)
      toast.promise(
        async () => {
          await createFinance({ ...data, iban: 'TR' + data.iban, vkn: undefined })
          queryClient.invalidateQueries({ queryKey: ['profile'] })
          router.push('/applications/new')
        },
        {
          pending: 'İşletme bilgileriniz kaydediliyor...',
          success: 'İşletme bilgileriniz başarıyla kaydedildi',
          error: {
            render({ data }: { data: AxiosError<{ message?: string }> }) {
              return data?.response?.data?.message ?? 'İşletme bilgileriniz kaydedilirken bir hata oluştu'
            }
          }
        }
      )
    },
    [createFinance, router, queryClient]
  )

  const showFourthStepperItem = step >= WelcomeOnboardingStep.Financial

  const value = useMemo<WelcomeOnboardingContextValue>(
    () => ({
      step,
      setStep,
      goNext,
      goBack,
      goToFinancialStep,
      showFourthStepperItem,
      form,
      taxNumberDisplay: profile?.data?.taxNumber,
      onFinancialSubmit,
      onFinancialCancel,
      uploadFinancialDocument,
      isCreatingFinance
    }),
    [
      step,
      form,
      goNext,
      goBack,
      goToFinancialStep,
      showFourthStepperItem,
      onFinancialSubmit,
      onFinancialCancel,
      uploadFinancialDocument,
      isCreatingFinance,
      profile?.data?.taxNumber
    ]
  )

  return <WelcomeOnboardingContext.Provider value={value}>{children}</WelcomeOnboardingContext.Provider>
}
