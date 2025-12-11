import { getItemJson, setItem } from '@/lib/local-storage-helper'
import { useQueryCounties, useQueryDistricts, useQueryProvinces } from '@/service/location.service'
import { usePaymentMethods } from '@/service/payment-methods.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ordersService } from '../../service/order.service'
import { createOrderSchema, defaultCreateOrderValues } from '../constants'
import type { CreateOrderFormData } from '../types'

export function useCreateOrder() {
  const { mutateAsync: createOrder, isPending: isSubmitting } = useMutation({
    mutationFn: (order: CreateOrderFormData) => ordersService.createOrder(order)
  })

  const form = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: defaultCreateOrderValues
  })
  // Şehir
  const cityId = useWatch({ control: form.control, name: 'city.id' })
  // İlçe
  const countyId = useWatch({ control: form.control, name: 'county.id' })
  // Mahalle
  // Ödeme Tipi
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = usePaymentMethods()
  const paymentMethodOptions = paymentMethods?.map(paymentMethod => ({
    value: paymentMethod.key,
    label: paymentMethod.name
  }))

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
      const selectedDistrict = districts?.find(d => d.mahalle_id.toString() === districtId)
      if (selectedDistrict) {
        form.setValue('district', { id: districtId, name: selectedDistrict.mahalle_adi })
      }
    },
    [form, districts]
  )

  const onSubmit = async (data: CreateOrderFormData) => {
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
    handleCityChange,
    handleCountyChange,
    handleDistrictChange,
    onSubmit,
    paymentMethodOptions,
    provinceOptions,
    countyOptions,
    districtOptions,
    isLoadingPaymentMethods,
    isLoadingProvinces,
    isLoadingCounties,
    isLoadingDistricts
  }
}
