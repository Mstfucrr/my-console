'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { FormMaskedInputField } from '@/components/form/FormMaskedInputField'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { WelcomeCompanyType } from '@/modules/welcome/types'
import type { IProfileData } from '@/types/profile'
import { Building2Icon } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

type AccountBusinessFormValues = {
  companyType: WelcomeCompanyType
  companyName: string
  taxOffice: string
  tckn: string
  vkn: string
  iban: string
}

export function AccountBusinessCard({ data }: { data: IProfileData | undefined }) {
  const fd = useMemo(() => data?.financialDetails, [data])
  const form = useForm<AccountBusinessFormValues>({
    defaultValues: {
      companyType: fd?.companyType as WelcomeCompanyType,
      companyName: fd?.companyName ?? '',
      taxOffice: fd?.taxOffice ?? '',
      tckn: fd?.tckn ?? '',
      vkn: data?.taxNumber ?? '',
      iban: fd?.iban ?? ''
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-base'>
          <Building2Icon className='h-4 w-4' />
          İşletme bilgileri
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className='flex flex-col gap-x-4 gap-y-2'>
            <FormInputField
              name='companyName'
              control={form.control}
              label='Şirket Adı'
              readOnly
              disabled
              tabIndex={-1}
            />

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormInputField
                name='companyType'
                control={form.control}
                label='Şirket Türü'
                type='text'
                readOnly
                disabled
                tabIndex={-1}
              />

              <FormInputField
                name='taxOffice'
                control={form.control}
                label='Vergi Dairesi'
                readOnly
                disabled
                tabIndex={-1}
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormMaskedInputField
                mask='0 0 0 0 0 0 0 0 0 0 0'
                lazy={false}
                type='text'
                name='tckn'
                control={form.control}
                label='TCKN'
                readOnly
                disabled
                tabIndex={-1}
              />

              <FormInputField
                name='vkn'
                control={form.control}
                label='VKN'
                readOnly
                disabled
                tabIndex={-1}
                className='font-mono'
              />
            </div>
            <FormMaskedInputField
              mask='TR00 0000 0000 0000 0000 0000 00'
              lazy={false}
              type='text'
              name='iban'
              control={form.control}
              label='IBAN'
              readOnly
              disabled
              tabIndex={-1}
              className='font-mono'
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
