'use client'

import {
  useTurkishAddressCascade,
  type AddressResolutionCandidates,
  type AppliedAddressSelection
} from '@/hooks/useTurkishAddressCascade'
import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import type { StoreApplicationStepCompletedEvent } from '@/lib/analytics/types'
import { parseStoreApplicationWizardStep } from '@/lib/nuqs-parsers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  APPLICATION_STEPS,
  branchFormSchema,
  createStoreApplicationSchema,
  defaultBranchFormValues,
  defaultLocationFormValues,
  defaultWorkingHoursFormValues,
  locationFormSchema,
  StoreApplicationWizardStepIndex,
  workingHoursFormSchema,
  type BranchFormData,
  type LocationFormData,
  type WorkingHoursFormData
} from '../constants'
import { useStoreLocationSync } from '../hooks/useStoreLocationSync'
import { storeApplicationService } from '../service/store-application.service'
import type { CreateStoreApplicationPayload, SectorOption } from '../service/store-application.service.type'
import { buildStoreApplicationPayload } from '../utils/build-store-application-payload'
import { mergeStoreApplicationValues } from '../utils/merge-store-application-values'

export type ApplicationStep = (typeof APPLICATION_STEPS)[number]['key']

export type StoreApplicationAddressFields = {
  cityId: string | undefined
  countyId: string | undefined
  districtId: string | undefined
  handleCityChange: (id: string | number) => void
  handleCountyChange: (id: string) => void
  handleDistrictChange: (id: string) => void
  handleStreetChange: (id: string) => void
  provinceOptions: { value: string; label: string }[] | undefined
  countyOptions: { value: string; label: string }[] | undefined
  districtOptions: { value: string; label: string }[] | undefined
  streetOptions: { value: string; label: string }[] | undefined
  applyAddressSelection: (params: AddressResolutionCandidates) => Promise<AppliedAddressSelection | null>
  isLoadingProvinces: boolean
  isLoadingCounties: boolean
  isLoadingDistricts: boolean
  isLoadingStreets: boolean
}

type StoreApplicationWizardContextValue = {
  locationForm: UseFormReturn<LocationFormData>
  branchForm: UseFormReturn<BranchFormData>
  workingHoursForm: UseFormReturn<WorkingHoursFormData>
  stepIndex: StoreApplicationWizardStepIndex
  activeMainStep: ApplicationStep
  goNext: () => Promise<void>
  goBack: () => void
  submitFinal: () => Promise<void>
  sectors: SectorOption[]
  isLoadingSectors: boolean
  isSubmitting: boolean
  addressFields: StoreApplicationAddressFields
  handleMapPositionChange: (lat: number, lng: number) => void
  handleUseCurrentLocation: () => Promise<boolean>
  isDetectingCurrentLocation: boolean
  mapFillsAddressFromPin: boolean
  setMapFillsAddressFromPin: Dispatch<SetStateAction<boolean>>
}

const StoreApplicationWizardContext = createContext<StoreApplicationWizardContextValue | null>(null)

const rhfStepFormOptions = { mode: 'onSubmit' as const, reValidateMode: 'onChange' as const }

export function StoreApplicationWizardProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [stepQuery, setStepQuery] = useQueryState('step', parseStoreApplicationWizardStep)
  const stepIndex = APPLICATION_STEPS.findIndex(step => step.key === stepQuery)
  const [mapFillsAddressFromPin, setMapFillsAddressFromPin] = useState(true)

  const locationForm = useForm<LocationFormData>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: defaultLocationFormValues,
    ...rhfStepFormOptions
  })

  const branchForm = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: defaultBranchFormValues,
    ...rhfStepFormOptions
  })

  const workingHoursForm = useForm<WorkingHoursFormData>({
    resolver: zodResolver(workingHoursFormSchema),
    defaultValues: defaultWorkingHoursFormValues,
    ...rhfStepFormOptions
  })

  const address = useTurkishAddressCascade(locationForm, {
    fullAddressFormat: 'store'
  })

  const { handleMapPositionChange, handleUseCurrentLocation, isDetectingCurrentLocation } = useStoreLocationSync(
    locationForm,
    address,
    mapFillsAddressFromPin
  )

  const { data: sectors = [], isLoading: isLoadingSectors } = useQuery({
    queryKey: ['store-applications', 'sectors'],
    queryFn: () => storeApplicationService.getSectors(),
    staleTime: 1000 * 60 * 60 * 2 // 2 saat
  })

  const { mutateAsync: submitApplication, isPending: isSubmitting } = useMutation({
    mutationFn: (payload: CreateStoreApplicationPayload) => storeApplicationService.createApplication(payload)
  })

  const goNext = useCallback(async () => {
    if (stepIndex >= StoreApplicationWizardStepIndex.WorkingHours) return
    const currentForm = [locationForm, branchForm, workingHoursForm][stepIndex]
    const stepKey = APPLICATION_STEPS[stepIndex]?.key

    await currentForm.handleSubmit(
      () => {
        if (stepKey) {
          track<StoreApplicationStepCompletedEvent>(ANALYTICS_EVENTS.storeApplicationStepCompleted, {
            step: stepKey,
            status: 'success'
          })
        }
        setStepQuery(APPLICATION_STEPS[stepIndex + 1]?.key ?? APPLICATION_STEPS[0].key)
      },
      () => {}
    )()
  }, [stepIndex, locationForm, branchForm, workingHoursForm, setStepQuery])

  const goBack = useCallback(() => {
    setStepQuery(APPLICATION_STEPS[stepIndex - 1]?.key ?? APPLICATION_STEPS[0].key)
  }, [stepIndex, setStepQuery])

  const submitFinal = useCallback(async () => {
    await workingHoursForm.handleSubmit(async () => {
      const merged = mergeStoreApplicationValues(
        locationForm.getValues(),
        branchForm.getValues(),
        workingHoursForm.getValues()
      )

      const parsed = createStoreApplicationSchema.safeParse(merged)
      if (!parsed.success) {
        track<StoreApplicationStepCompletedEvent>(ANALYTICS_EVENTS.storeApplicationStepCompleted, {
          step: 'workingHours',
          status: 'failed'
        })
        toast.error('Form doğrulanamadı')
        return
      }

      try {
        const payload = buildStoreApplicationPayload(parsed.data)
        await toast.promise(submitApplication(payload), {
          pending: 'Başvuru gönderiliyor...',
          success: 'Başvurunuz alındı',
          error: {
            render(props: { data?: AxiosError<{ message?: string }> }) {
              return props.data?.response?.data?.message ?? 'Başvuru gönderilemedi'
            }
          }
        })
        track<StoreApplicationStepCompletedEvent>(ANALYTICS_EVENTS.storeApplicationStepCompleted, {
          step: 'workingHours',
          status: 'success',
          city_name: parsed.data.city.name,
          district_name: parsed.data.district.name,
          sector_name: parsed.data.sector,
          sub_sector_names: parsed.data.subSectors,
          restaurant_name: parsed.data.restaurantName
        })
        queryClient.invalidateQueries({ queryKey: ['store-applications'] })
        router.push('/applications')
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        track<StoreApplicationStepCompletedEvent>(ANALYTICS_EVENTS.storeApplicationStepCompleted, {
          step: 'workingHours',
          status: 'failed',
          http_status: axiosError.response?.status ?? null,
          message: axiosError.response?.data?.message ?? null
        })
      }
    })()
  }, [branchForm, locationForm, queryClient, router, submitApplication, workingHoursForm])

  const activeMainStep: ApplicationStep = APPLICATION_STEPS[stepIndex]?.key ?? 'location'

  const value: StoreApplicationWizardContextValue = {
    locationForm,
    branchForm,
    workingHoursForm,
    stepIndex,
    activeMainStep,
    goNext,
    goBack,
    submitFinal,
    sectors,
    isLoadingSectors,
    isSubmitting,
    addressFields: address,
    handleMapPositionChange,
    handleUseCurrentLocation,
    isDetectingCurrentLocation,
    mapFillsAddressFromPin,
    setMapFillsAddressFromPin
  }

  return <StoreApplicationWizardContext.Provider value={value}>{children}</StoreApplicationWizardContext.Provider>
}

export function useStoreApplicationWizard() {
  const ctx = useContext(StoreApplicationWizardContext)
  if (!ctx) {
    throw new Error('useStoreApplicationWizard must be used within StoreApplicationWizardProvider')
  }
  return ctx
}
