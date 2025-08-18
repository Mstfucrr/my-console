'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { createContext, useContext, type ReactNode } from 'react'
import { FormProvider, useForm, type Control, type UseFormSetValue, type UseFormWatch } from 'react-hook-form'
import { z } from 'zod'

const onboardingSchema = z.object({
  // Company Info
  companyName: z.string().min(1, 'Şirket adı gereklidir'),
  companyType: z.string().min(1, 'Şirket türü seçimi gereklidir'),
  taxNumber: z
    .string()
    .min(1, 'Vergi numarası gereklidir')
    .regex(/^[0-9]{10}$/, '10 haneli vergi numarası giriniz'),
  taxOffice: z.string().min(1, 'Vergi dairesi gereklidir'),
  companyPhone: z.string().min(1, 'Şirket telefonu gereklidir'),
  companyEmail: z.string().email('Geçerli e-posta adresi giriniz'),

  // Address Info
  companyAddress: z.string().min(1, 'Şirket adresi gereklidir'),
  companyCity: z.string().min(1, 'İl seçimi gereklidir'),
  companyDistrict: z.string().min(1, 'İlçe seçimi gereklidir'),
  billingAddress: z.string().min(1, 'Fatura adresi gereklidir'),
  billingCity: z.string().min(1, 'İl seçimi gereklidir'),
  billingDistrict: z.string().min(1, 'İlçe seçimi gereklidir'),
  sameAsCompany: z.boolean().default(false),

  // Contact Info
  managerName: z.string().min(1, 'Yönetici adı soyadı gereklidir'),
  managerPhone: z.string().min(1, 'Yönetici telefonu gereklidir'),
  managerEmail: z.string().email('Geçerli e-posta adresi giriniz'),
  accountantName: z.string().min(1, 'Muhasebe sorumlusu adı soyadı gereklidir'),
  accountantPhone: z.string().min(1, 'Muhasebe telefonu gereklidir'),
  accountantEmail: z.string().email('Geçerli e-posta adresi giriniz'),

  // Bank Info
  bankName: z.string().min(1, 'Banka adı gereklidir'),
  iban: z
    .string()
    .min(1, 'IBAN gereklidir')
    .regex(/^TR[0-9]{24}$/, 'Geçerli IBAN formatı: TR + 24 rakam'),
  accountHolder: z.string().min(1, 'Hesap sahibi gereklidir'),
  branchCode: z.string().optional(),

  // Preferences
  notifications: z.boolean().default(true),
  marketing: z.boolean().default(false),
  analytics: z.boolean().default(true)
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>

interface OnboardingContextType {
  control: Control<OnboardingFormData>
  watch: UseFormWatch<OnboardingFormData>
  setValue: UseFormSetValue<OnboardingFormData>
  isStepValid: (step: number) => boolean
  getStepData: () => OnboardingFormData
  handleSubmit: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      // Company Info
      companyName: '',
      companyType: '',
      taxNumber: '',
      taxOffice: '',
      companyPhone: '',
      companyEmail: '',

      // Address Info
      companyAddress: '',
      companyCity: '',
      companyDistrict: '',
      billingAddress: '',
      billingCity: '',
      billingDistrict: '',
      sameAsCompany: false,

      // Contact Info
      managerName: '',
      managerPhone: '',
      managerEmail: '',
      accountantName: '',
      accountantPhone: '',
      accountantEmail: '',

      // Bank Info
      bankName: '',
      iban: '',
      accountHolder: '',
      branchCode: '',

      // Preferences
      notifications: true,
      marketing: false,
      analytics: true
    }
  })

  const isStepValid = (step: number): boolean => {
    const values = form.getValues()
    switch (step) {
      case 0:
        return !!(
          values.companyName &&
          values.companyType &&
          values.taxNumber &&
          values.taxOffice &&
          values.companyPhone &&
          values.companyEmail
        )
      case 1:
        return !!(
          values.companyAddress &&
          values.companyCity &&
          values.companyDistrict &&
          values.billingAddress &&
          values.billingCity &&
          values.billingDistrict
        )
      case 2:
        return !!(
          values.managerName &&
          values.managerPhone &&
          values.managerEmail &&
          values.accountantName &&
          values.accountantPhone &&
          values.accountantEmail
        )
      case 3:
        return !!(values.bankName && values.iban && values.accountHolder)
      default:
        return true
    }
  }

  const getStepData = () => form.getValues()

  const handleSubmit = () => {
    const data = form.getValues()
    console.log('[v0] Onboarding data:', data)
    // Handle form submission here
  }

  return (
    <OnboardingContext.Provider
      value={{
        control: form.control,
        watch: form.watch,
        setValue: form.setValue,
        isStepValid,
        getStepData,
        handleSubmit
      }}
    >
      <FormProvider {...form}>{children}</FormProvider>
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
