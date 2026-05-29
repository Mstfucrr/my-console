import { GroupedSelectOption } from '@/components/form/FormSelectField'
import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import { OrderCreateEvent, PurchaseCompletedEvent } from '@/lib/analytics/types'
import { getItemJson, setItem } from '@/lib/local-storage-helper'
import { toCents } from '@/lib/money'
import { groupPaymentMethods } from '@/lib/payment-methods'
import { useTurkishAddressCascade } from '@/hooks/useTurkishAddressCascade'
import { usePaymentMethods } from '@/service/payment-methods.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
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
  const {
    provinces,
    cityId,
    countyId,
    districtId,
    handleCityChange,
    handleCountyChange,
    handleDistrictChange,
    handleStreetChange,
    provinceOptions,
    countyOptions,
    districtOptions,
    streetOptions,
    isLoadingProvinces,
    isLoadingCounties,
    isLoadingDistricts,
    isLoadingStreets
  } = useTurkishAddressCascade<CreateOrderFormData>(form, {
    fullAddressFormat: 'order'
  })

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
