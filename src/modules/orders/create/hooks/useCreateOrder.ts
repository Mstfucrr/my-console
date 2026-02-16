import { GroupedSelectOption } from '@/components/form/FormSelectField'
import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import { OrderCreateEvent, PurchaseCompletedEvent } from '@/lib/analytics/types'
import { getItemJson, setItem } from '@/lib/local-storage-helper'
import { toCents } from '@/lib/money'
import { groupPaymentMethods } from '@/lib/payment-methods'
import { useQueryCounties, useQueryDistricts, useQueryProvinces, useQueryStreets } from '@/service/location.service'
import { usePaymentMethods } from '@/service/payment-methods.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ordersService } from '../../service/order.service'
import { createOrderSchema, defaultCreateOrderValues } from '../constants'
import type { CreateOrderFormData } from '../types'

export function useCreateOrder() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: defaultCreateOrderValues
  })
  // Şehir
  const cityId = useWatch({ control: form.control, name: 'city.id' })
  // İlçe
  const countyId = useWatch({ control: form.control, name: 'county.id' })
  // Mahalle
  const districtId = useWatch({ control: form.control, name: 'district.id' })
  // Ödeme Tipi
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = usePaymentMethods()

  const paymentMethodOptionsGrouped = useMemo<GroupedSelectOption[] | undefined>(
    () => groupPaymentMethods(paymentMethods),
    [paymentMethods]
  )

  const { mutateAsync: createOrder, isPending: isSubmitting } = useMutation({
    mutationFn: (order: CreateOrderFormData) => ordersService.createOrder(order),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['ordersStats'] })
        queryClient.invalidateQueries({ queryKey: ['latest-orders'] })
        queryClient.invalidateQueries({ queryKey: ['orders', 'active'] })
      }, 300)
      const body = {
        total_amount: toCents(form.getValues('totalAmount')),
        city_name: form.getValues('city.name'),
        county_name: form.getValues('county.name'),
        district_name: form.getValues('district.name'),
        payment_type_name: paymentMethods?.find(p => p.key === form.getValues('paymentTypeSId'))?.name ?? undefined
      }
      track<OrderCreateEvent>(ANALYTICS_EVENTS.orderCreate, {
        status: 'success',
        ...body
      })
      track<PurchaseCompletedEvent>(ANALYTICS_EVENTS.purchaseCompleted, body)
    },
    onError: error => {
      const errorResponse = (error as AxiosError<{ message: string }>).response
      track<OrderCreateEvent>(ANALYTICS_EVENTS.orderCreate, {
        status: 'failed',
        http_status: errorResponse?.status ?? null,
        message: errorResponse?.data?.message ?? null
      })
    }
  })

  // Şehir
  const { data: provinces, isLoading: isLoadingProvinces } = useQueryProvinces()
  const provinceOptions = provinces?.map(province => ({ value: province.il_id.toString(), label: province.il_adi }))

  // İlçe
  const { data: counties, isLoading: isLoadingCounties } = useQueryCounties(Number(cityId), !!cityId)
  const countyOptions = counties?.map(county => ({ value: county.ilce_id.toString(), label: county.ilce_adi }))

  // Mahalle
  const { data: districts, isLoading: isLoadingDistricts } = useQueryDistricts(Number(countyId), !!countyId)
  const districtOptions = districts?.map(district => ({
    value: district.mahalle_id.toString(),
    label: district.mahalle_adi
  }))

  // Sokak
  const { data: streets, isLoading: isLoadingStreets } = useQueryStreets(Number(districtId), !!districtId)
  const streetOptions = streets?.map(street => ({ value: street.sokak_adi, label: street.sokak_adi }))

  // 🔹 Adres alanlarını tek seferde watch et (tek subscription)
  const [city, county, district, street, buildingNumber, floor, buildingName, doorNumber] = useWatch({
    control: form.control,
    name: ['city', 'county', 'district', 'street', 'buildingNumber', 'floor', 'buildingName', 'doorNumber'] as const
  })

  // 🔹 Tam adresi useMemo ile hesapla (sadece depend'ler değişince)
  const computedFullAddress = useMemo(() => {
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
      if (locationPart.length > 0) {
        parts.push(locationPart)
      }
    }

    return parts.length > 0 ? parts.join(', ') : ''
  }, [city, county, district, street, buildingNumber, floor, buildingName, doorNumber])

  // 🔹 Tam adresi form state'e sadece gerekirse yaz
  useEffect(() => {
    const current = form.getValues('fullAddress')
    if (current !== computedFullAddress) {
      form.setValue('fullAddress', computedFullAddress, {
        shouldValidate: false, // submit'te validate ederiz
        shouldDirty: true // istersen false da verebilirsin
      })
    }
  }, [computedFullAddress, form])

  // Şehir değiştiğinde ilçe ve mahalleyi temizle
  const handleCityChange = useCallback(
    (cityId: string | number) => {
      if (cityId === '') {
        form.setValue('city', { id: '', name: '' })
        form.setValue('county', { id: '', name: '' })
        form.setValue('district', { id: '', name: '' })
        form.setValue('street', '')
        return
      }
      const cityIdString = cityId.toString()
      if (!provinces) return
      const selectedProvince = provinces?.find(p => p.il_id.toString() === cityIdString)
      if (!selectedProvince) return
      if (selectedProvince) {
        form.setValue('city', { id: cityIdString, name: selectedProvince.il_adi })
        form.setValue('county', { id: '', name: '' })
        form.setValue('district', { id: '', name: '' })
      }
      form.setFocus('county.id')
    },
    [form, provinces]
  )

  // İlçe değiştiğinde mahalleyi temizle
  const handleCountyChange = useCallback(
    (countyId: string) => {
      if (countyId === '') {
        form.setValue('county', { id: '', name: '' })
        form.setValue('district', { id: '', name: '' })
        form.setValue('street', '')
        return
      }
      const selectedCounty = counties?.find(c => c.ilce_id.toString() === countyId)
      if (selectedCounty) {
        form.setValue('county', { id: countyId, name: selectedCounty.ilce_adi })
        form.setValue('district', { id: '', name: '' })
      }
      form.setFocus('district.id')
    },
    [form, counties]
  )

  // Mahalle değiştiğinde sokağı temizle
  const handleDistrictChange = useCallback(
    (districtId: string) => {
      if (districtId === '') {
        form.setValue('district', { id: '', name: '' })
        form.setValue('street', '')
        return
      }
      const selectedDistrict = districts?.find(d => d.mahalle_id.toString() === districtId)
      if (selectedDistrict) {
        form.setValue('district', { id: districtId, name: selectedDistrict.mahalle_adi })
        form.setValue('street', '')
      }
    },
    [form, districts]
  )

  // Sokak değiştiğinde adresi temizle
  const handleStreetChange = useCallback(
    (streetId: string) => {
      form.setValue('street', streetId)
    },
    [form]
  )

  const onSubmit = async (data: CreateOrderFormData) => {
    track<OrderCreateEvent>(ANALYTICS_EVENTS.orderCreate, {
      status: 'attempt',
      total_amount: toCents(data.totalAmount),
      city_name: data.city?.name,
      county_name: data.county?.name,
      district_name: data.district?.name,
      payment_type_name: paymentMethods?.find(p => p.key === data.paymentTypeSId)?.name ?? undefined
    })

    try {
      await toast.promise(async () => await createOrder(data), {
        pending: 'Sipariş oluşturuluyor...',
        success: 'Sipariş başarıyla oluşturuldu',
        error: {
          render({ data }: { data: AxiosError<{ message: string }> }) {
            return data?.response?.data?.message || 'Sipariş oluşturulurken bir hata oluştu'
          }
        }
      })
      // Reset'i bir sonraki tick'te yap (validation'ın tamamlanmasını bekle)
      setTimeout(() => {
        form.reset({ ...defaultCreateOrderValues, city: data.city }, { keepErrors: false })
        form.setFocus('firstName')
        setItem('last-order-city', data.city)
        router.push('/orders')
      }, 0)
      return true
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!provinces) return
    const lastOrderCity = getItemJson('last-order-city')
    if (!lastOrderCity) return
    handleCityChange(lastOrderCity.id)
  }, [handleCityChange, provinces])

  return {
    form,
    isSubmitting,
    cityId,
    countyId,
    districtId,
    handleCityChange,
    handleCountyChange,
    handleDistrictChange,
    handleStreetChange,
    onSubmit,
    paymentMethodOptionsGrouped,
    provinceOptions,
    countyOptions,
    districtOptions,
    streetOptions,
    isLoadingPaymentMethods,
    isLoadingProvinces,
    isLoadingCounties,
    isLoadingDistricts,
    isLoadingStreets
  }
}
