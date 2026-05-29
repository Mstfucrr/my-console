import { FormInputField } from '@/components/form/FormInputField'
import { PASSWORD_REGEXES, PasswordRequirements } from '@/components/password-requirements'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import { PasswordChangeEvent } from '@/lib/analytics/types'
import { authService } from '@/modules/auth/service/auth.service'
import { OnboardingHeading } from '@/modules/tenant/onboarding/components/OnboardingHeading'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { ArrowLeft, ArrowRight, CheckCircle, Key, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const schema = z
  .object({
    codeFromEmail: z
      .string()
      .min(6, { message: 'Kod 6 haneli olmalıdır.' })
      .max(6, { message: 'Kod 6 haneli olmalıdır.' }),
    newPassword: z
      .string()
      .min(8, { message: 'Şifre en az 8 karakter olmalıdır.' })
      .regex(PASSWORD_REGEXES.lowercase, { message: 'Şifre en az bir küçük harf içermelidir.' })
      .regex(PASSWORD_REGEXES.uppercase, { message: 'Şifre en az bir büyük harf içermelidir.' })
      .regex(PASSWORD_REGEXES.number, { message: 'Şifre en az bir rakam içermelidir.' }),
    confirmNewPassword: z.string().min(1, { message: 'Şifre tekrarı zorunludur.' })
  })
  .superRefine((data, ctx) => {
    if (data.confirmNewPassword === '' || data.newPassword === '') return
    if (data.confirmNewPassword !== data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Şifreler eşleşmiyor.',
        path: ['confirmNewPassword']
      })
    }
  })

type ResetPasswordFormType = z.infer<typeof schema>

export function ResetPasswordView() {
  const [isSuccess, setIsSuccess] = useState(false)
  const searchParams = useSearchParams()
  const recoverySessionId = searchParams.get('recoverySessionId')
  const router = useRouter()

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      codeFromEmail: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  const { handleSubmit, control, formState, trigger } = form

  const newPasswordValue = useWatch({ control, name: 'newPassword', defaultValue: '' })
  const confirmNewPasswordValue = useWatch({ control, name: 'confirmNewPassword', defaultValue: '' })

  useEffect(() => {
    // İkisi de boşken gereksiz trigger etme
    if (!newPasswordValue || !confirmNewPasswordValue) return

    void trigger('confirmNewPassword')
  }, [newPasswordValue, confirmNewPasswordValue, trigger])

  useEffect(() => {
    if (!recoverySessionId) {
      toast.error('Geçersiz şifre sıfırlama bağlantısı.')
      router.push('/forgot-password')
    }
  }, [recoverySessionId, router])

  const onSubmit = async (data: ResetPasswordFormType) => {
    if (!recoverySessionId) {
      toast.error('Geçersiz şifre sıfırlama bağlantısı.')
      router.push('/forgot-password')
      return
    }

    try {
      // Backend'e confirm code isteği gönder
      const response = await authService.confirmCode({
        recoverySessionId,
        code: data.codeFromEmail,
        newPassword: data.newPassword
      })

      setIsSuccess(true)
      track<PasswordChangeEvent>(ANALYTICS_EVENTS.passwordChange, { status: 'success' })
      toast.success(response.message || 'Şifreniz başarıyla güncellendi.')
    } catch (error) {
      console.error('reset password error', error)
      const axiosError = error as AxiosError<{ message?: string }>
      const message = axiosError.response?.data?.message ?? 'Bir hata oluştu. Lütfen tekrar deneyiniz.'
      track<PasswordChangeEvent>(ANALYTICS_EVENTS.passwordChange, {
        status: 'failed',
        http_status: axiosError.response?.status ?? null,
        message
      })
      toast.error(message)
    }
  }

  if (isSuccess) {
    return (
      <div className='w-full space-y-4 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
          <CheckCircle className='h-8 w-8 text-green-600' />
        </div>
        <h2 className='text-xl font-semibold text-gray-900'>Şifre Güncellendi</h2>
        <p className='text-gray-600'>Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.</p>
        <Button color='primary' onClick={() => router.replace('/login')}>
          <ArrowRight className='mr-2 h-4 w-4' /> Giriş Yap
        </Button>
      </div>
    )
  }

  return (
    <>
      <OnboardingHeading
        variant='page'
        title='Yeni Şifre Belirle'
        description='E-posta adresinize gönderilen 6 haneli kodu girin ve yeni şifrenizi belirleyin.'
      />

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <FormInputField
            name='codeFromEmail'
            autoComplete='off'
            control={control}
            type='text'
            id='codeFromEmail'
            size='lg'
            disabled={formState.isSubmitting}
            placeholder='Mail adresinize gönderilen kodu giriniz'
            Icon={Key}
            maxLength={6}
            inputMode='numeric'
            pattern='[0-9]*'
          />

          <div className='relative'>
            <FormInputField
              name='newPassword'
              autoComplete='off'
              control={control}
              type='password'
              id='newPassword'
              size='lg'
              disabled={formState.isSubmitting}
              placeholder='Yeni şifrenizi giriniz'
              Icon={Lock}
            />
          </div>

          <div className='relative'>
            <FormInputField
              name='confirmNewPassword'
              autoComplete='off'
              control={control}
              type='password'
              id='confirmNewPassword'
              size='lg'
              disabled={formState.isSubmitting}
              placeholder='Yeni şifrenizi tekrar giriniz'
              Icon={Lock}
            />
          </div>

          <PasswordRequirements password={newPasswordValue} />

          <LoadingButton
            type='submit'
            className='w-full'
            isLoading={formState.isSubmitting}
            size='md'
            loadingText='Güncelleniyor...'
          >
            Şifreyi Güncelle
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
