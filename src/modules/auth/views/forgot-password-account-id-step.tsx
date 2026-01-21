'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { LoadingButton } from '@/components/ui/loading-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AuthTurnstile } from '../components/turnstile'
import { useTurnstile } from '../hooks/useTurnstile'

export const accountIdSchema = z.object({
  email: z.string().min(1, { message: 'E-posta zorunludur.' }).email({ message: 'Geçerli bir e-posta giriniz.' }),
  accountId: z.string().min(1, { message: 'Hesap ID zorunludur.' })
})

export type AccountIdFormType = z.infer<typeof accountIdSchema>

interface ForgotPasswordAccountIdStepProps {
  email: string
  onSubmit: (data: AccountIdFormType) => Promise<void>
}

export function ForgotPasswordAccountIdStep({ email, onSubmit }: ForgotPasswordAccountIdStepProps) {
  const turnstileState = useTurnstile()

  const accountIdForm = useForm<AccountIdFormType>({
    resolver: zodResolver(accountIdSchema),
    mode: 'onBlur',
    defaultValues: {
      email: email,
      accountId: ''
    }
  })

  return (
    <div className='w-full space-y-4'>
      <div className='text-center'>
        <h2 className='text-primary text-xl font-bold'>Şifremi Unuttum</h2>
        <p className='mt-2 text-sm text-gray-600'>
          Bu email adresine ait birden fazla hesap bulundu. Lütfen hesap ID&apos;nizi giriniz.
        </p>
      </div>

      <FormProvider {...accountIdForm}>
        <form onSubmit={accountIdForm.handleSubmit(onSubmit)} className='space-y-4'>
          <FormInputField
            name='email'
            control={accountIdForm.control}
            type='email'
            id='email'
            size='lg'
            disabled={true}
            placeholder='E-posta'
            Icon={Mail}
          />

          <FormInputField
            name='accountId'
            control={accountIdForm.control}
            type='text'
            id='accountId'
            size='lg'
            disabled={accountIdForm.formState.isSubmitting}
            placeholder='Hesap ID giriniz'
            Icon={User}
            autoFocus
          />

          <AuthTurnstile turnstileState={turnstileState} />

          <LoadingButton
            className='w-full'
            isLoading={accountIdForm.formState.isSubmitting}
            size='lg'
            loadingText='Gönderiliyor...'
            disabled={!turnstileState.isValid}
          >
            Şifre Sıfırlama Kodu Gönder
          </LoadingButton>
        </form>
      </FormProvider>

      <div className='text-center'>
        <Link
          href='/login'
          className='text-primary flex w-fit items-center justify-center gap-1 justify-self-center text-sm hover:underline'
        >
          <ArrowLeft className='h-4 w-4' />
          Giriş sayfasına dön
        </Link>
      </div>
    </div>
  )
}
