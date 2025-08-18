'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { FormSelectField } from '@/components/form/FormSelectField'
import { useOnboarding } from '../../context/OnboardingContext'
import { banks } from '../../data'

export default function BankInfoStep() {
  const { control } = useOnboarding()

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6'>
        <FormSelectField
          label='Banka Adı'
          placeholder='Bankanızı seçiniz'
          name='bankName'
          control={control}
          options={banks}
          required
        />

        <FormInputField
          label='IBAN'
          placeholder='TR12 3456 7890 1234 5678 9012 34'
          name='iban'
          control={control}
          maxLength={26}
          required
        />

        <FormInputField
          label='Hesap Sahibi'
          placeholder='ABC RESTORAN LTD. ŞTİ.'
          name='accountHolder'
          control={control}
          required
        />

        <FormInputField
          label='Şube Kodu (Opsiyonel)'
          placeholder='1234'
          name='branchCode'
          control={control}
          maxLength={4}
        />
      </div>
    </div>
  )
}
