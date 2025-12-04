import type { County, District, Province, Street } from '@/service/location.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ordersService } from '../../service/order.service'
import { createOrderSchema } from '../constants'
import type { CreateOrderFormData } from '../types'

export function useCreateOrder() {
  const { mutateAsync: createOrder, isPending: isSubmitting } = useMutation({
    mutationFn: (order: CreateOrderFormData) => ordersService.createOrder(order)
  })

  const form = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema)
    // defaultValues: testAutoFillFormData
  })

  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState.errors])

  // Form değerlerini watch ile takip et
  // Şehir
  const cityId = useWatch({ control: form.control, name: 'city.id' })
  // İlçe
  const countyId = useWatch({ control: form.control, name: 'county.id' })
  // Mahalle
  const districtId = useWatch({ control: form.control, name: 'district.id' })
  // Sokak
  const streetId = useWatch({ control: form.control, name: 'street.id' })

  // Şehir değiştiğinde ilçe ve mahalleyi temizle
  const handleCityChange = (cityId: string, provinces?: Province[]) => {
    const selectedProvince = provinces?.find(p => p.il_id.toString() === cityId)
    if (selectedProvince) {
      form.setValue('city', { id: cityId, name: selectedProvince.il_adi })
      form.setValue('county', { id: '', name: '' })
      form.setValue('district', { id: '', name: '' })
      form.setValue('street', { id: '', name: '' })
    }
  }

  // İlçe değiştiğinde mahalleyi temizle
  const handleCountyChange = (countyId: string, counties?: County[]) => {
    const selectedCounty = counties?.find(c => c.ilce_id.toString() === countyId)
    if (selectedCounty) {
      form.setValue('county', { id: countyId, name: selectedCounty.ilce_adi })
      form.setValue('district', { id: '', name: '' })
      form.setValue('street', { id: '', name: '' })
    }
  }

  // Mahalle değiştiğinde sokağı temizle
  const handleDistrictChange = (districtId: string, districts?: District[]) => {
    const selectedDistrict = districts?.find(d => d.mahalle_id.toString() === districtId)
    if (selectedDistrict) {
      form.setValue('district', { id: districtId, name: selectedDistrict.mahalle_adi })
      form.setValue('street', { id: '', name: '' })
    }
  }

  // Sokak değiştiğinde adresi temizle
  const handleStreetChange = (streetId: string, streets?: Street[]) => {
    const selectedStreet = streets?.find(s => s.sokak_id.toString() === streetId)
    if (selectedStreet) {
      form.setValue('street', { id: streetId, name: selectedStreet.sokak_adi })
    }
  }

  const onSubmit = async (data: CreateOrderFormData) => {
    toast.promise(async () => await createOrder(data), {
      pending: 'Sipariş oluşturuluyor...',
      success: 'Sipariş başarıyla oluşturuldu',
      error: 'Sipariş oluşturulurken bir hata oluştu'
    })
  }

  return {
    form,
    isSubmitting,
    cityId,
    countyId,
    districtId,
    streetId,
    handleCityChange,
    handleCountyChange,
    handleDistrictChange,
    handleStreetChange,
    onSubmit
  }
}
