'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { Separator } from '@/components/ui/separator'
import { useOnboarding } from '../../context/OnboardingContext'

export default function ContactInfoStep() {
  const { control } = useOnboarding()

  return (
    <div className='space-y-6'>
      {/* Şube Yöneticisi */}
      <div className='space-y-4'>
        <div className='flex items-center'>
          <Separator className='flex-1' />
          <span className='text-muted-foreground px-4 text-sm font-medium'>Şube Yöneticisi</span>
          <Separator className='flex-1' />
        </div>

        <FormInputField
          label='Yönetici Adı Soyadı'
          placeholder='Ahmet Yılmaz'
          name='managerName'
          control={control}
          required
        />

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormInputField
            label='Yönetici Telefonu'
            placeholder='+90 555 123 45 67'
            name='managerPhone'
            control={control}
            required
          />

          <FormInputField
            label='Yönetici E-postası'
            placeholder='yonetici@firma.com'
            name='managerEmail'
            control={control}
            type='email'
            required
          />
        </div>
      </div>

      {/* Muhasebe Sorumlusu */}
      <div className='space-y-4'>
        <div className='flex items-center'>
          <Separator className='flex-1' />
          <span className='text-muted-foreground px-4 text-sm font-medium'>Muhasebe Sorumlusu</span>
          <Separator className='flex-1' />
        </div>

        <FormInputField
          label='Muhasebe Sorumlusu Adı Soyadı'
          placeholder='Fatma Demir'
          name='accountantName'
          control={control}
          required
        />

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormInputField
            label='Muhasebe Telefonu'
            placeholder='+90 555 987 65 43'
            name='accountantPhone'
            control={control}
            required
          />

          <FormInputField
            label='Muhasebe E-postası'
            placeholder='muhasebe@firma.com'
            name='accountantEmail'
            control={control}
            type='email'
            required
          />
        </div>
      </div>
    </div>
  )
}
