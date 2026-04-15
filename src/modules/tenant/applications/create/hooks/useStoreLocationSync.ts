'use client'

import type { AppliedAddressSelection } from '@/hooks/useTurkishAddressCascade'
import {
  reverseGeocodeCoordinates,
  searchCoordinatesByAddress,
  type NominatimAddress
} from '@/service/geocoding.service'
import { useCallback, useEffect, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import type { LocationFormData } from '../constants'
import type { StoreApplicationAddressFields } from '../context/StoreApplicationWizardContext'

const DEBOUNCE_MS = 700

function buildGeocodeQuery(values: {
  cityName: string
  countyName: string
  districtName: string
  street: string
  doorNumber: string
}) {
  const city = values.cityName.trim()
  const county = values.countyName.trim()
  const district = values.districtName.trim()
  const street = values.street.trim()
  const doorNumber = values.doorNumber.trim()

  if (!city || !county) return null

  return [street, doorNumber ? `No:${doorNumber}` : '', district, county, city, 'Turkey'].filter(Boolean).join(', ')
}

function uniqueNonEmpty(values: Array<string | undefined>) {
  return Array.from(new Set(values.map(value => value?.trim()).filter((value): value is string => Boolean(value))))
}

function extractReverseAddressCandidates(address: NominatimAddress) {
  return {
    cityNames: uniqueNonEmpty([address.province, address.state_district, address.state, address.city]),
    countyNames: uniqueNonEmpty([
      address.county,
      address.city_district,
      address.municipality,
      address.town,
      address.city,
      address.state_district
    ]),
    districtNames: uniqueNonEmpty([
      address.neighbourhood,
      address.quarter,
      address.suburb,
      address.village,
      address.hamlet,
      address.city_district
    ]),
    streetNames: uniqueNonEmpty([address.road, address.pedestrian])
  }
}

function buildSuppressedQuery(address: AppliedAddressSelection | null, doorNumber: string) {
  if (!address) return null
  return buildGeocodeQuery({
    cityName: address.cityName,
    countyName: address.countyName,
    districtName: address.districtName,
    street: address.streetName,
    doorNumber
  })
}

export function useStoreLocationSync(
  form: UseFormReturn<LocationFormData>,
  addressFields: Pick<StoreApplicationAddressFields, 'applyAddressSelection'>,
  syncAddressFromMap: boolean
) {
  const cityName = useWatch({ control: form.control, name: 'city.name' })
  const countyName = useWatch({ control: form.control, name: 'county.name' })
  const districtName = useWatch({ control: form.control, name: 'district.name' })
  const street = useWatch({ control: form.control, name: 'street' })
  const doorNumber = useWatch({ control: form.control, name: 'doorNumber' })

  const lastAppliedQueryRef = useRef<string | null>(null)
  const suppressedQueryRef = useRef<string | null>(null)
  const geocodeAbortRef = useRef<AbortController | null>(null)
  const reverseAbortRef = useRef<AbortController | null>(null)
  const reverseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestReverseRequestIdRef = useRef(0)

  useEffect(() => {
    if (!syncAddressFromMap) {
      geocodeAbortRef.current?.abort()
      geocodeAbortRef.current = null
      return
    }

    const query = buildGeocodeQuery({
      cityName: cityName ?? '',
      countyName: countyName ?? '',
      districtName: districtName ?? '',
      street: street ?? '',
      doorNumber: doorNumber ?? ''
    })
    if (!query) return
    if (query === suppressedQueryRef.current) {
      suppressedQueryRef.current = null
      lastAppliedQueryRef.current = query
      return
    }
    if (query === lastAppliedQueryRef.current) return

    const abortController = new AbortController()
    geocodeAbortRef.current?.abort()
    geocodeAbortRef.current = abortController

    const timer = setTimeout(async () => {
      try {
        const coordinates = await searchCoordinatesByAddress(query, abortController.signal)
        if (!coordinates) return
        lastAppliedQueryRef.current = query
        form.setValue('latitude', coordinates.latitude, { shouldDirty: true })
        form.setValue('longitude', coordinates.longitude, { shouldDirty: true })
      } catch {
        /* abort veya ağ */
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      abortController.abort()
      if (geocodeAbortRef.current === abortController) {
        geocodeAbortRef.current = null
      }
    }
  }, [cityName, countyName, districtName, street, doorNumber, form, syncAddressFromMap])

  useEffect(() => {
    return () => {
      geocodeAbortRef.current?.abort()
      reverseAbortRef.current?.abort()
      if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current)
    }
  }, [])

  const handleMapPositionChange = useCallback(
    (latitude: number, longitude: number) => {
      form.setValue('latitude', latitude, { shouldDirty: true })
      form.setValue('longitude', longitude, { shouldDirty: true })

      if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current)

      if (!syncAddressFromMap) {
        reverseAbortRef.current?.abort()
        reverseAbortRef.current = null
        return
      }

      const requestId = latestReverseRequestIdRef.current + 1
      latestReverseRequestIdRef.current = requestId

      reverseTimerRef.current = setTimeout(async () => {
        const abortController = new AbortController()
        reverseAbortRef.current?.abort()
        reverseAbortRef.current = abortController

        try {
          const reverseAddress = await reverseGeocodeCoordinates(latitude, longitude, abortController.signal)
          if (!syncAddressFromMap) return
          if (!reverseAddress || latestReverseRequestIdRef.current !== requestId) return

          const appliedAddress = await addressFields.applyAddressSelection(
            extractReverseAddressCandidates(reverseAddress)
          )
          if (!syncAddressFromMap) return
          if (latestReverseRequestIdRef.current !== requestId) return

          const suppressedQuery = buildSuppressedQuery(appliedAddress, form.getValues('doorNumber') ?? '')
          if (suppressedQuery) {
            suppressedQueryRef.current = suppressedQuery
            lastAppliedQueryRef.current = null
          }
        } catch {
          /* abort veya ağ */
        } finally {
          if (reverseAbortRef.current === abortController) {
            reverseAbortRef.current = null
          }
        }
      }, DEBOUNCE_MS)
    },
    [addressFields, form, syncAddressFromMap]
  )

  return { handleMapPositionChange }
}
