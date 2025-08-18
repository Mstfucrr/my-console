'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { FormSelectField } from '@/components/form/FormSelectField'
import { useOnboarding } from '../../context/OnboardingContext'
import { companyTypes } from '../../data'

export default function CompanyInfoStep() {
  const { control } = useOnboarding()

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6'>
        <FormInputField
          label='Şirket Adı'
          placeholder='ABC Restoran Ltd. Şti.'
          name='companyName'
          control={control}
          required
        />

        <FormSelectField
          label='Şirket Türü'
          placeholder='Şirket türünü seçiniz'
          name='companyType'
          control={control}
          options={companyTypes}
          required
        />

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormInputField
            label='Vergi Numarası'
            placeholder='1234567890'
            name='taxNumber'
            control={control}
            maxLength={10}
            required
          />

          <FormInputField
            label='Vergi Dairesi'
            placeholder='Kadıköy Vergi Dairesi'
            name='taxOffice'
            control={control}
            required
          />
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormInputField
            label='Şirket Telefonu'
            placeholder='+90 212 123 45 67'
            name='companyPhone'
            control={control}
            required
          />

          <FormInputField
            label='Şirket E-postası'
            placeholder='info@firma.com'
            name='companyEmail'
            control={control}
            type='email'
            required
          />
        </div>
      </div>
    </div>
  )
}
