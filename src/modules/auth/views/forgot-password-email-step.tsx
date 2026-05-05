'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { OnboardingHeading } from '@/modules/tenant/onboarding/components/OnboardingHeading'
import type { AccountType } from '@/types/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { FormProvider, useController, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AuthTurnstile } from '../components/turnstile'
import { useTurnstile } from '../hooks/useTurnstile'

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'store', label: 'Şube' },
  { value: 'tenant', label: 'İşletme' }
]

export const emailSchema = z.object({
  accountType: z.enum(['tenant', 'store'], { required_error: 'Hesap türü zorunludur.' }).default('store'),
  email: z.string().min(1, { message: 'E-posta zorunludur.' }).email({ message: 'Geçerli bir e-posta giriniz.' })
})

export type EmailFormType = z.infer<typeof emailSchema>

interface ForgotPasswordEmailStepProps {
  onSubmit: (data: EmailFormType) => Promise<void>
}

export function ForgotPasswordEmailStep({ onSubmit }: ForgotPasswordEmailStepProps) {
  const turnstileState = useTurnstile()

  const emailForm = useForm<EmailFormType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      accountType: 'store',
      email: ''
    }
  })

  const {
    field: accountTypeField,
    fieldState: { error: accountTypeError }
  } = useController({ name: 'accountType', control: emailForm.control })

  return (
    <>
      <OnboardingHeading
        description='Hesap türünüzü seçin, e-posta adresinize sıfırlama kodu gönderelim.'
        variant='page'
        title='Şifremi Unuttum'
      />

      <FormProvider {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col gap-2 text-left'>
            <div className='flex w-full items-center justify-between gap-2'>
              {ACCOUNT_TYPES.map(item => (
                <Button
                  type='button'
                  key={item.value}
                  variant={item.value === accountTypeField.value ? undefined : 'outline'}
                  size='sm'
                  color='primary'
                  className={cn('flex-1 text-sm', accountTypeError && 'border-destructive')}
                  onClick={() => accountTypeField.onChange(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            {accountTypeError && (
              <p className='text-destructive px-1 text-xs leading-none'>{accountTypeError.message}</p>
            )}
          </div>

          <FormInputField
            name='email'
            control={emailForm.control}
            type='email'
            id='email'
            size='lg'
            autoFocus
            disabled={emailForm.formState.isSubmitting}
            placeholder='E-posta'
            Icon={Mail}
          />

          <AuthTurnstile turnstileState={turnstileState} />

          <LoadingButton
            type='submit'
            className='w-full'
            isLoading={emailForm.formState.isSubmitting}
            size='md'
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
    </>
  )
}
