'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { PASSWORD_REGEXES, PasswordRequirements } from '@/components/password-requirements'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import type { OnboardingStepCompletedEvent } from '@/lib/analytics/types'
import { OnboardingHeading } from '@/modules/tenant/onboarding/components/OnboardingHeading'
import { useOnboarding } from '@/modules/tenant/onboarding/context/OnboardingContext'
import { useTenantPasswordSetupMutation } from '@/modules/tenant/onboarding/hooks/useTanentMutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { CheckCircle2, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Şifre en az 8 karakter olmalıdır.' })
      .regex(PASSWORD_REGEXES.lowercase, { message: 'Şifre en az bir küçük harf içermelidir.' })
      .regex(PASSWORD_REGEXES.uppercase, { message: 'Şifre en az bir büyük harf içermelidir.' })
      .regex(PASSWORD_REGEXES.number, { message: 'Şifre en az bir rakam içermelidir.' })
      .regex(PASSWORD_REGEXES.special, { message: 'Şifre en az bir özel karakter içermelidir.' }),
    confirmPassword: z.string().min(1, { message: 'Şifre tekrarı zorunludur.' })
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Şifreler eşleşmiyor.',
        path: ['confirmPassword']
      })
    }
  })

type PasswordSetupFormValues = z.infer<typeof schema>

export function SetPasswordView() {
  const { passwordSetupToken, setPasswordSetupToken } = useOnboarding()
  const [isSuccess, setIsSuccess] = useState(false)
  const { mutateAsync: setupPassword, isPending: isSettingPassword } = useTenantPasswordSetupMutation()

  const form = useForm<PasswordSetupFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const passwordValue = useWatch({ control: form.control, name: 'password', defaultValue: '' })

  const onSubmit = async (data: PasswordSetupFormValues) => {
    if (!passwordSetupToken) {
      toast.error('Şifre belirleme oturumu bulunamadı.')
      return
    }

    try {
      await toast.promise(
        async () =>
          await setupPassword({
            passwordSetupToken,
            password: data.password
          }),
        {
          pending: 'Şifre kaydediliyor...',
          success: {
            render({ data }) {
              return data?.message || 'Şifreniz başarıyla belirlendi.'
            }
          },
          error: {
            render({ data }: { data: AxiosError<{ message?: string }> }) {
              return data?.response?.data?.message || 'Şifre belirlenirken bir hata oluştu.'
            }
          }
        }
      )
      track<OnboardingStepCompletedEvent>(ANALYTICS_EVENTS.onboardingStepCompleted, {
        step: 'password-setup',
        status: 'success'
      })
      setPasswordSetupToken(null)
      setIsSuccess(true)
    } catch (error) {
      console.error('tenant password setup error', error)
      const axiosError = error as AxiosError<{ message?: string }>
      track<OnboardingStepCompletedEvent>(ANALYTICS_EVENTS.onboardingStepCompleted, {
        step: 'password-setup',
        status: 'failed',
        http_status: axiosError.response?.status ?? null,
        message: axiosError.response?.data?.message ?? null
      })
    }
  }

  if (isSuccess) {
    return (
      <>
        <CheckCircle2 className='mx-auto size-12 text-green-600' />
        <OnboardingHeading
          variant='success'
          title='Şifreniz Başarıyla Belirlendi'
          description='Artık hesabınıza giriş yapabilirsiniz.'
        />
        <Button asChild className='w-full' size='md'>
          <Link href='/login'>Giriş Ekranına Git</Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <OnboardingHeading variant='page' title='Şifre Belirle' description='Aşağıdaki alanda şifrenizi belirleyiniz.' />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <FormInputField
            Icon={Lock}
            name='password'
            control={form.control}
            type='password'
            size='lg'
            autoComplete='new-password'
            placeholder='Yeni şifre'
            autoFocus
            tabIndex={1}
          />
          <FormInputField
            Icon={Lock}
            name='confirmPassword'
            control={form.control}
            type='password'
            size='lg'
            autoComplete='new-password'
            placeholder='Şifre tekrar'
            tabIndex={2}
          />
          <PasswordRequirements password={passwordValue} includeSpecialCharacters />
          <LoadingButton
            type='submit'
            className='w-full'
            size='md'
            isLoading={isSettingPassword}
            loadingText='Kaydediliyor...'
            disabled={!form.formState.isValid || isSettingPassword}
          >
            Şifreyi Kaydet
          </LoadingButton>
        </form>
      </FormProvider>
    </>
  )
}
