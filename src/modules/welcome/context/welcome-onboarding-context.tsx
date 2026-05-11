'use client'

import { useProfile } from '@/context/ProfileProvider'
import { parseBusinessSetupStep } from '@/lib/nuqs-parsers'
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
import { BUSINESS_SETUP_STEP_QUERY_KEYS, BusinessSetupStep } from '../constants'
import { financeService } from '../service/finance.service'
import { SaveFinancialDetailsRequest, WelcomeDocType } from '../types'

export type WelcomeOnboardingContextValue = {
  step: BusinessSetupStep
  goNext: () => void
  goBack: () => void
  goToBusinessInfoStep: () => void
  form: UseFormReturn<WelcomeFinancialFormValues>
  taxNumberDisplay: string | undefined
  onBusinessInfoSubmit: (data: WelcomeFinancialFormValues) => void
  onBusinessInfoCancel: () => void
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
  const [stepQuery, setStepQuery] = useQueryState('step', parseBusinessSetupStep)

  const stepIndex = BUSINESS_SETUP_STEP_QUERY_KEYS.indexOf(stepQuery)
  const step = (stepIndex === -1 ? BusinessSetupStep.Intro : stepIndex) as BusinessSetupStep

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
    if (step >= BusinessSetupStep.ApplicationProcess) return
    void setStepQuery(BUSINESS_SETUP_STEP_QUERY_KEYS[step + 1])
  }, [setStepQuery, step])

  const goBack = useCallback(() => {
    if (step <= BusinessSetupStep.Intro) return
    void setStepQuery(BUSINESS_SETUP_STEP_QUERY_KEYS[step - 1])
  }, [setStepQuery, step])

  const goToBusinessInfoStep = useCallback(() => {
    void setStepQuery(BUSINESS_SETUP_STEP_QUERY_KEYS[BusinessSetupStep.BusinessInfo])
  }, [setStepQuery])

  const onBusinessInfoCancel = useCallback(() => {
    void setStepQuery(BUSINESS_SETUP_STEP_QUERY_KEYS[BusinessSetupStep.ApplicationProcess])
  }, [setStepQuery])

  const onBusinessInfoSubmit = useCallback(
    (data: WelcomeFinancialFormValues) => {
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

  const value = useMemo<WelcomeOnboardingContextValue>(
    () => ({
      step,
      goNext,
      goBack,
      goToBusinessInfoStep,
      form,
      taxNumberDisplay: profile?.data?.taxNumber,
      onBusinessInfoSubmit,
      onBusinessInfoCancel,
      uploadFinancialDocument,
      isCreatingFinance
    }),
    [
      step,
      form,
      goNext,
      goBack,
      goToBusinessInfoStep,
      onBusinessInfoSubmit,
      onBusinessInfoCancel,
      uploadFinancialDocument,
      isCreatingFinance,
      profile?.data?.taxNumber
    ]
  )

  return <WelcomeOnboardingContext.Provider value={value}>{children}</WelcomeOnboardingContext.Provider>
}
