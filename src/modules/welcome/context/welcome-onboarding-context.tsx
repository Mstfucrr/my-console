'use client'

import { useProfile } from '@/context/ProfileProvider'
import { parseWelcomeOnboardingStep } from '@/lib/nuqs-parsers'
import {
  defaultWelcomeFinancialValues,
  welcomeFinancialFormSchema,
  type WelcomeFinancialFormValues
} from '@/modules/welcome/schemas/welcome-financial-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { WELCOME_ONBOARDING_STEP_QUERY_KEYS, WelcomeOnboardingStep } from '../constants'
import { financeService } from '../service/finance.service'
import { SaveFinancialDetailsRequest, WelcomeDocType } from '../types'

export type WelcomeOnboardingContextValue = {
  step: WelcomeOnboardingStep
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
  const queryClient = useQueryClient()
  const router = useRouter()
  const [stepQuery, setStepQuery] = useQueryState('step', parseWelcomeOnboardingStep)

  const stepIndex = WELCOME_ONBOARDING_STEP_QUERY_KEYS.indexOf(stepQuery)
  const step = (stepIndex === -1 ? WelcomeOnboardingStep.Intro : stepIndex) as WelcomeOnboardingStep

  const { mutateAsync: createFinance, isPending: isCreatingFinance } = useMutation({
    mutationFn: (data: SaveFinancialDetailsRequest) => financeService.createFinance(data)
  })

  const { mutateAsync: uploadFinancialDocument } = useMutation({
    mutationFn: ({ file, docType }: { file: File; docType: WelcomeDocType }) =>
      financeService.uploadDocument(file, docType)
  })

  const form = useForm<WelcomeFinancialFormValues>({
    resolver: zodResolver(welcomeFinancialFormSchema),
    defaultValues: {
      ...defaultWelcomeFinancialValues,
      vkn: profile?.data?.taxNumber
    }
  })

  const goNext = useCallback(() => {
    if (step >= WelcomeOnboardingStep.Application) return
    void setStepQuery(WELCOME_ONBOARDING_STEP_QUERY_KEYS[step + 1])
  }, [setStepQuery, step])

  const goBack = useCallback(() => {
    if (step <= WelcomeOnboardingStep.Intro) return
    void setStepQuery(WELCOME_ONBOARDING_STEP_QUERY_KEYS[step - 1])
  }, [setStepQuery, step])

  const goToFinancialStep = useCallback(() => {
    void setStepQuery(WELCOME_ONBOARDING_STEP_QUERY_KEYS[WelcomeOnboardingStep.Financial])
  }, [setStepQuery])

  const onFinancialCancel = useCallback(() => {
    void setStepQuery(WELCOME_ONBOARDING_STEP_QUERY_KEYS[WelcomeOnboardingStep.Application])
  }, [setStepQuery])

  const onFinancialSubmit = useCallback(
    (data: WelcomeFinancialFormValues) => {
      // Gerçek uygulamada API çağrısı
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
