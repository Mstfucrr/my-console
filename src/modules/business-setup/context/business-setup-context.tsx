'use client'

import { useProfile } from '@/context/ProfileProvider'
import { parseBusinessSetupStep } from '@/lib/nuqs-parsers'
import {
  defaultBusinessInfoValues,
  businessInfoFormSchema,
  type BusinessInfoFormValues
} from '@/modules/business-setup/schemas/business-info-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { BUSINESS_SETUP_STEP_QUERY_KEYS, BusinessSetupStep } from '../constants'
import { businessInfoService } from '../service/business-info.service'
import { SaveBusinessInfoRequest, BusinessInfoDocType } from '../types'

export type BusinessSetupContextValue = {
  step: BusinessSetupStep
  goNext: () => void
  goBack: () => void
  goToBusinessInfoStep: () => void
  form: UseFormReturn<BusinessInfoFormValues>
  taxNumberDisplay: string | undefined
  onBusinessInfoSubmit: (data: BusinessInfoFormValues) => void
  onBusinessInfoCancel: () => void
  uploadBusinessInfoDocument: (data: { file: File; docType: BusinessInfoDocType }) => Promise<string>
  isSavingBusinessInfo: boolean
}

const BusinessSetupContext = createContext<BusinessSetupContextValue | null>(null)

export function useBusinessSetup() {
  const ctx = useContext(BusinessSetupContext)
  if (!ctx) {
    throw new Error('useBusinessSetup must be used within BusinessSetupProvider')
  }
  return ctx
}

export function BusinessSetupProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [stepQuery, setStepQuery] = useQueryState('step', parseBusinessSetupStep)

  const stepIndex = BUSINESS_SETUP_STEP_QUERY_KEYS.indexOf(stepQuery)
  const step = (stepIndex === -1 ? BusinessSetupStep.Intro : stepIndex) as BusinessSetupStep

  const { mutateAsync: saveBusinessInfo, isPending: isSavingBusinessInfo } = useMutation({
    mutationFn: (data: SaveBusinessInfoRequest) => businessInfoService.saveBusinessInfo(data)
  })

  const { mutateAsync: uploadBusinessInfoDocument } = useMutation({
    mutationFn: ({ file, docType }: { file: File; docType: BusinessInfoDocType }) =>
      businessInfoService.uploadDocument(file, docType)
  })

  const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoFormSchema),
    defaultValues: {
      ...defaultBusinessInfoValues,
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
    (data: BusinessInfoFormValues) => {
      toast.promise(
        async () => {
          await saveBusinessInfo({ ...data, iban: 'TR' + data.iban, vkn: undefined })
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
    [saveBusinessInfo, router, queryClient]
  )

  const value = useMemo<BusinessSetupContextValue>(
    () => ({
      step,
      goNext,
      goBack,
      goToBusinessInfoStep,
      form,
      taxNumberDisplay: profile?.data?.taxNumber,
      onBusinessInfoSubmit,
      onBusinessInfoCancel,
      uploadBusinessInfoDocument,
      isSavingBusinessInfo
    }),
    [
      step,
      form,
      goNext,
      goBack,
      goToBusinessInfoStep,
      onBusinessInfoSubmit,
      onBusinessInfoCancel,
      uploadBusinessInfoDocument,
      isSavingBusinessInfo,
      profile?.data?.taxNumber
    ]
  )

  return <BusinessSetupContext.Provider value={value}>{children}</BusinessSetupContext.Provider>
}
