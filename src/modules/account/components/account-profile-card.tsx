'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { FormPhoneField } from '@/components/form/FormPhoneField'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { phoneLabel } from '@/lib/phoen-label'
import type { IProfileData } from '@/types/profile'
import { UserIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

type AccountProfileFormValues = {
  firstName: string
  surname: string
  email: string
  phoneNumber: string
}

export function AccountProfileCard({ data }: { data: IProfileData | undefined }) {
  const profile = useMemo(() => data, [data])
  const form = useForm<AccountProfileFormValues>({
    defaultValues: {
      firstName: profile?.firstName ?? '',
      surname: profile?.surname ?? '',
      email: profile?.email ?? '',
      phoneNumber: phoneLabel(profile?.phoneNumber)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-base'>
          <UserIcon className='h-4 w-4' />
          Profil bilgileri
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className='flex flex-col gap-x-4 gap-y-2'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormInputField name='firstName' control={form.control} label='Ad' readOnly disabled tabIndex={-1} />
              <FormInputField name='surname' control={form.control} label='Soyad' readOnly disabled tabIndex={-1} />
            </div>
            <FormInputField
              name='email'
              control={form.control}
              label='E-posta'
              type='email'
              readOnly
              disabled
              tabIndex={-1}
            />
            <FormPhoneField name='phoneNumber' control={form.control} label='Telefon' readOnly disabled tabIndex={-1} />
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
