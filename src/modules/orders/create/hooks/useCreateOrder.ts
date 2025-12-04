import { addressData } from '@/modules/citiesData'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { createOrderSchema } from '../constants'
import type { CreateOrderFormData } from '../types'

export function useCreateOrder() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([])

  const form = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema)
  })

  // Şehir değiştiğinde ilçeleri güncelle
  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    setSelectedDistrict('')
    setAvailableDistricts(addressData.districts[city] || [])
    setAvailableNeighborhoods([])
    form.setValue('county', '')
    form.setValue('neighborhood', '')
  }

  // İlçe değiştiğinde mahalleleri güncelle
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district)
    setAvailableNeighborhoods(addressData.neighborhoods[district] || [])
    form.setValue('neighborhood', '')
  }

  const onSubmit = async (data: CreateOrderFormData) => {
    setIsSubmitting(true)
    try {
      // Create order object according to the required JSON structure
      const orderData = {
        orderId: `ORD-${Date.now()}`,
        storeId: 'store_001',
        salesChannelSId: 'portal',
        isTestOrder: false,
        restaurantSId: 'rest_001',
        paymentMethod: data.paymentTypeSId,
        integration: 'manuel',
        preparationTime: data.preparationTime,
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          customerPhone: data.customerPhone,
          extensionPhone: data.extensionPhone || undefined
        },
        address: {
          city: data.city,
          county: data.county,
          neighborhood: data.neighborhood,
          street: data.street,
          buildingName: data.buildingName || undefined,
          buildingNumber: data.buildingNumber || undefined,
          floor: data.floor || undefined,
          doorNumber: data.doorNumber || undefined,
          addressDirection: data.addressDirection || undefined,
          fullAddress: data.fullAddress,
          countryCode: 'TR',
          postalCode: data.postalCode || undefined
        },
        payment: {
          paymentTypeSId: data.paymentTypeSId,
          totalPrice: data.totalAmount
        },
        delivery: {
          contactlessDelivery: data.contactlessDelivery,
          ringDoorBell: data.ringDoorBell,
          category: 'standard',
          type: 'delivery'
        }
      }

      console.log('Creating order:', orderData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success('Sipariş başarıyla oluşturuldu!')
      router.push('/orders')
    } catch (error) {
      toast.error('Sipariş oluşturulurken bir hata oluştu.')
      console.error('Error creating order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    selectedCity,
    selectedDistrict,
    availableDistricts,
    availableNeighborhoods,
    handleCityChange,
    handleDistrictChange,
    onSubmit
  }
}
