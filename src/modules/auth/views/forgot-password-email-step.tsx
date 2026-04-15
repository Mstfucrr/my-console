'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { LoadingButton } from '@/components/ui/loading-button'
import { OnboardingHeading } from '@/modules/tenant/onboarding/components/OnboardingHeading'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AuthTurnstile } from '../components/turnstile'
import { useTurnstile } from '../hooks/useTurnstile'

export const emailSchema = z.object({
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
    mode: 'onBlur',
    defaultValues: {
      email: ''
    }
  })

  return (
    <>
      <OnboardingHeading
        description='E-posta adresinizi girin, size şifre sıfırlama kodu gönderelim.'
        variant='page'
        title='Şifremi Unuttum'
      />

      <FormProvider {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onSubmit)} className='space-y-4'>
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
