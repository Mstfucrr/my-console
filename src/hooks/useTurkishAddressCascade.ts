import {
  fetchCounties,
  fetchDistricts,
  fetchStreets,
  useQueryCounties,
  useQueryDistricts,
  useQueryProvinces,
  useQueryStreets
} from '@/service/location.service'
import type { County, District, Province } from '@/service/location.service.type'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

/** Ortak adres dilimi: sipariş ve şube başvuru formları için */
export type TurkishAddressFormSlice = {
  city: { id: string; name: string }
  county: { id: string; name: string }
  district: { id: string; name: string }
  street: string
  doorNumber: string
  fullAddress: string
  buildingNumber?: string
  floor?: string
  buildingName?: string
}

export type AddressFullFormat = 'order' | 'store'

export type AddressResolutionCandidates = {
  cityNames?: string[]
  countyNames?: string[]
  districtNames?: string[]
  streetNames?: string[]
}

export type AppliedAddressSelection = {
  cityName: string
  countyName: string
  districtName: string
  streetName: string
}

function normalizeAddressValue(value: string) {
  return value
    .toLocaleUpperCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\b(MAHALLESI|MAHALLE|MAH)\b/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildAddressVariants(value: string | undefined) {
  if (!value) return []
  const normalized = normalizeAddressValue(value)
  return normalized ? [normalized] : []
}

function matchesAddressCandidate(value: string, candidates: string[]) {
  const valueVariants = buildAddressVariants(value)
  if (valueVariants.length === 0) return false

  return candidates.some(candidate => {
    const candidateVariants = buildAddressVariants(candidate)
    if (candidateVariants.length === 0) return false
    return valueVariants.some(valueVariant =>
      candidateVariants.some(
        candidateVariant =>
          candidateVariant === valueVariant ||
          candidateVariant.includes(valueVariant) ||
          valueVariant.includes(candidateVariant)
      )
    )
  })
}

function findMatchingItem<T>(items: T[] | undefined, getLabel: (item: T) => string, candidates: string[] | undefined) {
  if (!items?.length || !candidates?.length) return undefined
  const normalizedCandidates = candidates.map(candidate => candidate.trim()).filter(Boolean)
  if (normalizedCandidates.length === 0) return undefined
  return items.find(item => matchesAddressCandidate(getLabel(item), normalizedCandidates))
}

/**
 * @template TFieldValues - Form verisi; adres dilimi `TurkishAddressFormSlice` ile uyumlu olmalı
 *   (örn. `CreateOrderFormData`, `CreateStoreApplicationFormData`).
 *   Çağrı: `useTurkishAddressCascade<CreateOrderFormData>(form)` — dışarıda cast gerekmez.
 *   İçeride `Path<T>` ile sabit alan adları eşleşmediği için tek bir `TurkishAddressFormSlice` cast’i kullanılır.
 */
export function useTurkishAddressCascade<TFieldValues extends FieldValues & TurkishAddressFormSlice>(
  form: UseFormReturn<TFieldValues>,
  options?: { fullAddressFormat?: AddressFullFormat }
) {
  const addressForm = form as unknown as UseFormReturn<TurkishAddressFormSlice>
  const fullAddressFormat = options?.fullAddressFormat ?? 'order'
  const queryClient = useQueryClient()

  const cityId = useWatch({ control: addressForm.control, name: 'city.id' })
  const countyId = useWatch({ control: addressForm.control, name: 'county.id' })
  const districtId = useWatch({ control: addressForm.control, name: 'district.id' })

  const { data: provinces, isLoading: isLoadingProvinces } = useQueryProvinces()
  const { data: counties, isLoading: isLoadingCounties } = useQueryCounties(Number(cityId), !!cityId)
  const { data: districts, isLoading: isLoadingDistricts } = useQueryDistricts(Number(countyId), !!countyId)
  const { data: streets, isLoading: isLoadingStreets } = useQueryStreets(Number(districtId), !!districtId)

  const provinceOptions = provinces?.map(province => ({ value: province.il_id.toString(), label: province.il_adi }))
  const countyOptions = counties?.map(county => ({ value: county.ilce_id.toString(), label: county.ilce_adi }))
  const districtOptions = districts?.map(district => ({
    value: district.mahalle_id.toString(),
    label: district.mahalle_adi
  }))
  const streetOptions = streets?.map(street => ({ value: street.sokak_adi, label: street.sokak_adi }))

  const [city, county, district, street, buildingNumber, floor, buildingName, doorNumber] = useWatch({
    control: addressForm.control,
    name: ['city', 'county', 'district', 'street', 'buildingNumber', 'floor', 'buildingName', 'doorNumber']
  })

  const computedFullAddress = useMemo(() => {
    if (fullAddressFormat === 'store') {
      const parts: string[] = []
      if (district?.name) parts.push(district.name)
      if (street) {
        parts.push(doorNumber ? `${street} No:${doorNumber}` : street)
      } else if (doorNumber) {
        parts.push(`No:${doorNumber}`)
      }
      if (county?.name || city?.name) {
        const tail = [county?.name, city?.name].filter(Boolean).join('/')
        if (tail) parts.push(tail)
      }
      return parts.length > 0 ? parts.join(', ') : ''
    }

    const parts: string[] = []
    if (district?.name) parts.push(district.name)
    if (buildingName) parts.push(buildingName)
    if (street) {
      const streetPart = buildingNumber ? `${street} No:${buildingNumber}` : street
      parts.push(streetPart)
    } else if (buildingNumber) {
      parts.push(`No:${buildingNumber}`)
    }
    if (floor) parts.push(`Kat:${floor}`)
    if (doorNumber) parts.push(`Daire:${doorNumber}`)
    if (county?.name || city?.name) {
      const locationPart = [county?.name, city?.name].filter(value => value && value.length > 0).join('/')
      if (locationPart.length > 0) parts.push(locationPart)
    }
    return parts.length > 0 ? parts.join(', ') : ''
  }, [fullAddressFormat, city, county, district, street, buildingNumber, floor, buildingName, doorNumber])

  useEffect(() => {
    const current = addressForm.getValues('fullAddress')
    if (current !== computedFullAddress) {
      addressForm.setValue('fullAddress', computedFullAddress, {
        shouldValidate: true,
        shouldDirty: true
      })
    }
  }, [computedFullAddress, addressForm])

  const clearCountyAndBelow = useCallback(() => {
    addressForm.setValue('county', { id: '', name: '' }, { shouldValidate: true, shouldDirty: true })
    addressForm.setValue('district', { id: '', name: '' }, { shouldValidate: true, shouldDirty: true })
    addressForm.setValue('street', '', { shouldValidate: true, shouldDirty: true })
  }, [addressForm])

  const clearDistrictAndStreet = useCallback(() => {
    addressForm.setValue('district', { id: '', name: '' }, { shouldValidate: true, shouldDirty: true })
    addressForm.setValue('street', '', { shouldValidate: true, shouldDirty: true })
  }, [addressForm])

  const handleCityChange = useCallback(
    (nextCityId: string | number) => {
      if (nextCityId === '') {
        addressForm.setValue('city', { id: '', name: '' }, { shouldValidate: true, shouldDirty: true })
        clearCountyAndBelow()
        return
      }
      const cityIdString = nextCityId.toString()
      if (!provinces) return
      const selectedProvince = provinces?.find((p: Province) => p.il_id.toString() === cityIdString)
      if (!selectedProvince) return
      addressForm.setValue(
        'city',
        { id: cityIdString, name: selectedProvince.il_adi },
        {
          shouldValidate: true,
          shouldDirty: true
        }
      )
      clearCountyAndBelow()
      addressForm.setFocus('county.id')
    },
    [addressForm, clearCountyAndBelow, provinces]
  )

  const handleCountyChange = useCallback(
    (nextCountyId: string) => {
      if (nextCountyId === '') {
        clearDistrictAndStreet()
        addressForm.setValue('county', { id: '', name: '' }, { shouldValidate: true, shouldDirty: true })
        return
      }
      const selectedCounty = counties?.find(c => c.ilce_id.toString() === nextCountyId)
      if (selectedCounty) {
        addressForm.setValue(
          'county',
          { id: nextCountyId, name: selectedCounty.ilce_adi },
          {
            shouldValidate: true,
            shouldDirty: true
          }
        )
        clearDistrictAndStreet()
      }
      addressForm.setFocus('district.id')
    },
    [addressForm, clearDistrictAndStreet, counties]
  )

  const handleDistrictChange = useCallback(
    (nextDistrictId: string) => {
      if (nextDistrictId === '') {
        addressForm.setValue('district', { id: '', name: '' }, { shouldValidate: true, shouldDirty: true })
        addressForm.setValue('street', '', { shouldValidate: true, shouldDirty: true })
        return
      }
      const selectedDistrict = districts?.find(d => d.mahalle_id.toString() === nextDistrictId)
      if (selectedDistrict) {
        addressForm.setValue(
          'district',
          { id: nextDistrictId, name: selectedDistrict.mahalle_adi },
          {
            shouldValidate: true,
            shouldDirty: true
          }
        )
        addressForm.setValue('street', '', { shouldValidate: true, shouldDirty: true })
      }
    },
    [addressForm, districts]
  )

  const handleStreetChange = useCallback(
    (streetId: string) => {
      addressForm.setValue('street', streetId, { shouldValidate: true, shouldDirty: true })
    },
    [addressForm]
  )

  const applyAddressSelection = useCallback(
    async ({ cityNames, countyNames, districtNames, streetNames }: AddressResolutionCandidates) => {
      const selectedProvince = findMatchingItem(provinces, province => province.il_adi, cityNames)
      if (!selectedProvince) return null

      addressForm.setValue(
        'city',
        { id: selectedProvince.il_id.toString(), name: selectedProvince.il_adi },
        { shouldDirty: true, shouldValidate: true }
      )
      clearCountyAndBelow()

      let selectedCounty: County | undefined
      if (countyNames?.length) {
        const nextCounties = await queryClient.ensureQueryData({
          queryKey: ['counties', selectedProvince.il_id],
          queryFn: () => fetchCounties(selectedProvince.il_id),
          staleTime: 1000 * 60 * 60 * 24
        })
        selectedCounty = findMatchingItem(nextCounties, county => county.ilce_adi, countyNames)
        if (selectedCounty) {
          addressForm.setValue(
            'county',
            { id: selectedCounty.ilce_id.toString(), name: selectedCounty.ilce_adi },
            { shouldDirty: true, shouldValidate: true }
          )
        } else {
          return {
            cityName: selectedProvince.il_adi,
            countyName: '',
            districtName: '',
            streetName: ''
          } satisfies AppliedAddressSelection
        }
      } else {
        return {
          cityName: selectedProvince.il_adi,
          countyName: '',
          districtName: '',
          streetName: ''
        } satisfies AppliedAddressSelection
      }

      let selectedDistrict: District | undefined
      if (districtNames?.length) {
        const nextDistricts = await queryClient.ensureQueryData({
          queryKey: ['districts', selectedCounty.ilce_id],
          queryFn: () => fetchDistricts(selectedCounty.ilce_id),
          staleTime: 1000 * 60 * 60 * 24
        })
        selectedDistrict = findMatchingItem(nextDistricts, district => district.mahalle_adi, districtNames)
        if (selectedDistrict) {
          addressForm.setValue(
            'district',
            { id: selectedDistrict.mahalle_id.toString(), name: selectedDistrict.mahalle_adi },
            { shouldDirty: true, shouldValidate: true }
          )
        } else {
          return {
            cityName: selectedProvince.il_adi,
            countyName: selectedCounty.ilce_adi,
            districtName: '',
            streetName: ''
          } satisfies AppliedAddressSelection
        }
      } else {
        return {
          cityName: selectedProvince.il_adi,
          countyName: selectedCounty.ilce_adi,
          districtName: '',
          streetName: ''
        } satisfies AppliedAddressSelection
      }

      let streetName = ''
      const firstStreetCandidate = streetNames?.find(candidate => candidate.trim().length > 0)?.trim() ?? ''
      if (firstStreetCandidate) {
        try {
          const nextStreets = await queryClient.ensureQueryData({
            queryKey: ['streets', selectedDistrict.mahalle_id],
            queryFn: () => fetchStreets(selectedDistrict.mahalle_id),
            staleTime: 1000 * 60 * 60 * 24
          })
          const selectedStreet = findMatchingItem(nextStreets, street => street.sokak_adi, streetNames)
          streetName = selectedStreet?.sokak_adi ?? firstStreetCandidate
        } catch {
          streetName = firstStreetCandidate
        }
        addressForm.setValue('street', streetName, { shouldDirty: true, shouldValidate: true })
      }

      return {
        cityName: selectedProvince.il_adi,
        countyName: selectedCounty.ilce_adi,
        districtName: selectedDistrict.mahalle_adi,
        streetName
      } satisfies AppliedAddressSelection
    },
    [addressForm, clearCountyAndBelow, provinces, queryClient]
  )

  return {
    provinces,
    cityId,
    countyId,
    districtId,
    handleCityChange,
    handleCountyChange,
    handleDistrictChange,
    handleStreetChange,
    applyAddressSelection,
    provinceOptions,
    countyOptions,
    districtOptions,
    streetOptions,
    isLoadingProvinces,
    isLoadingCounties,
    isLoadingDistricts,
    isLoadingStreets
  }
}
