import type { County, District, Province } from '@/service/location.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
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

  // Form değerlerini watch ile takip et
  // Şehir
  const cityId = useWatch({ control: form.control, name: 'city.id' })
  // İlçe
  const countyId = useWatch({ control: form.control, name: 'county.id' })
  // Mahalle

  // Şehir değiştiğinde ilçe ve mahalleyi temizle
  const handleCityChange = (cityId: string, provinces?: Province[]) => {
    const selectedProvince = provinces?.find(p => p.il_id.toString() === cityId)
    if (selectedProvince) {
      form.setValue('city', { id: cityId, name: selectedProvince.il_adi })
      form.setValue('county', { id: '', name: '' })
      form.setValue('district', { id: '', name: '' })
    }

    // focus
    form.setFocus('county.id')
  }

  // İlçe değiştiğinde mahalleyi temizle
  const handleCountyChange = (countyId: string, counties?: County[]) => {
    const selectedCounty = counties?.find(c => c.ilce_id.toString() === countyId)
    if (selectedCounty) {
      form.setValue('county', { id: countyId, name: selectedCounty.ilce_adi })
      form.setValue('district', { id: '', name: '' })
    }

    // focus
    form.setFocus('district.id')
  }

  // Mahalle değiştiğinde sokağı temizle
  const handleDistrictChange = (districtId: string, districts?: District[]) => {
    const selectedDistrict = districts?.find(d => d.mahalle_id.toString() === districtId)
    if (selectedDistrict) {
      form.setValue('district', { id: districtId, name: selectedDistrict.mahalle_adi })
    }
  }

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
        form.reset(defaultCreateOrderValues, { keepErrors: false })
        form.setFocus('firstName')
      }, 0)
      return true
    } catch (error) {
      console.error(error)
    }
  }

  return {
    form,
    isSubmitting,
    cityId,
    countyId,
    handleCityChange,
    handleCountyChange,
    handleDistrictChange,
    onSubmit
  }
}
