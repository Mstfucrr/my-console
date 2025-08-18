'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { FormSelectField } from '@/components/form/FormSelectField'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { cityDistricts } from '../../data'

export default function AddressInfoStep() {
  const { control, watch, setValue } = useOnboarding()
  const [selectedCompanyCity, setSelectedCompanyCity] = useState<string>('')
  const [selectedBillingCity, setSelectedBillingCity] = useState<string>('')

  const sameAsCompany = watch('sameAsCompany')
  const companyAddress = watch('companyAddress')
  const companyCity = watch('companyCity')
  const companyDistrict = watch('companyDistrict')
  const billingCity = watch('billingCity')

  // Effect for syncing billing fields if sameAsCompany is true
  useEffect(() => {
    if (sameAsCompany) {
      setValue('billingAddress', companyAddress || '')
      setValue('billingCity', companyCity || '')
      setValue('billingDistrict', companyDistrict || '')
      setSelectedBillingCity(companyCity || '')
    }
  }, [sameAsCompany, companyAddress, companyCity, companyDistrict, setValue])

  // Effect for updating selectedCompanyCity when companyCity changes
  useEffect(() => {
    if (companyCity !== selectedCompanyCity) {
      setSelectedCompanyCity(companyCity)
    }
  }, [companyCity, selectedCompanyCity])

  // Effect for updating selectedBillingCity when billingCity changes
  useEffect(() => {
    if (billingCity !== selectedBillingCity) {
      setSelectedBillingCity(billingCity)
    }
  }, [billingCity, selectedBillingCity])

  return (
    <div className='space-y-6'>
      {/* Şirket Adresi */}
      <div className='space-y-4'>
        <div className='flex items-center'>
          <Separator className='flex-1' />
          <span className='text-muted-foreground px-4 text-sm font-medium'>Şirket Adresi</span>
          <Separator className='flex-1' />
        </div>

        <FormInputField
          label='Şirket Adresi'
          placeholder='Detaylı şirket adresinizi giriniz'
          name='companyAddress'
          control={control}
          required
        />

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormSelectField
            label='İl'
            placeholder='İl seçiniz'
            name='companyCity'
            control={control}
            options={Object.keys(cityDistricts).map(city => ({ value: city, label: city }))}
            required
          />

          <FormSelectField
            label='İlçe'
            placeholder='İlçe seçiniz'
            name='companyDistrict'
            control={control}
            options={
              selectedCompanyCity
                ? cityDistricts[selectedCompanyCity]?.map(district => ({ value: district, label: district })) || []
                : []
            }
            required
            disabled={!selectedCompanyCity}
          />
        </div>
      </div>

      {/* Fatura Adresi */}
      <div className='space-y-4'>
        <div className='flex items-center'>
          <Separator className='flex-1' />
          <span className='text-muted-foreground px-4 text-sm font-medium'>Fatura Adresi</span>
          <Separator className='flex-1' />
        </div>

        <FormSwitchField label='Fatura adresi şirket adresi ile aynı' name='sameAsCompany' control={control} />

        <FormInputField
          label='Fatura Adresi'
          placeholder='Detaylı fatura adresinizi giriniz'
          name='billingAddress'
          control={control}
          required
        />

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormSelectField
            label='İl'
            placeholder='İl seçiniz'
            name='billingCity'
            control={control}
            options={Object.keys(cityDistricts).map(city => ({ value: city, label: city }))}
            required
          />

          <FormSelectField
            label='İlçe'
            placeholder='İlçe seçiniz'
            name='billingDistrict'
            control={control}
            options={
              selectedBillingCity
                ? cityDistricts[selectedBillingCity]?.map(district => ({ value: district, label: district })) || []
                : []
            }
            required
            disabled={!selectedBillingCity}
          />
        </div>
      </div>
    </div>
  )
}
