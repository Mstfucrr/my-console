'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { LoadingButton } from '@/components/ui/loading-button'
import { authService } from '@/modules/auth/service/auth.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const schema = z.object({
  accountId: z.string().min(1, { message: 'Hesap ID zorunludur.' }),
  email: z.string().min(1, { message: 'E-posta zorunludur.' }).email({ message: 'Geçerli bir e-posta giriniz.' })
})

type ForgotPasswordFormType = z.infer<typeof schema>

const ForgotPasswordForm = () => {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [recoverySessionId, setRecoverySessionId] = useState<string | null>(null)

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      accountId: '',
      email: ''
    }
  })

  const { handleSubmit, control } = form

  const onSubmit = async (data: ForgotPasswordFormType) => {
    try {
      // Backend'e password recovery isteği gönder
      const response = await authService.passwordRecovery({
        accountId: data.accountId,
        email: data.email
      })

      // recoverySessionId'yi sakla (state veya localStorage'a)
      setRecoverySessionId(response.recoverySessionId)
      setIsEmailSent(true)
      toast.success(response.message || 'Şifre sıfırlama kodu e-posta adresinize gönderildi.')
    } catch (error) {
      console.error('forgot password error', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
  }

  if (isEmailSent && recoverySessionId) {
    return (
      <div className='w-full space-y-4 text-center'>
        <div className='flex items-center justify-center gap-2'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
            <Mail className='h-8 w-8 text-green-600' />
          </div>
          <h2 className='text-primary text-xl font-bold'>E-posta Gönderildi</h2>
        </div>
        <p className='text-gray-600'>
          Şifre sıfırlama kodu <strong>{form.getValues('email')}</strong> adresine gönderildi.
        </p>
        <p className='text-sm text-gray-500'>E-postanızı kontrol edin ve kodu girin.</p>
        <div className='flex flex-col gap-2'>
          <Link
            href={`/reset-password?recoverySessionId=${recoverySessionId}`}
            className='text-primary text-sm hover:underline'
          >
            Kodu Gir ve Şifreyi Sıfırla
          </Link>
          <Link href='/login' className='text-primary text-sm hover:underline'>
            Giriş sayfasına dön
          </Link>
          <button onClick={() => setIsEmailSent(false)} className='text-primary text-sm hover:underline'>
            Başka e-posta ile dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full space-y-4'>
      <div className='text-center'>
        <h2 className='text-primary text-xl font-bold'>Şifremi Unuttum</h2>
        <p className='mt-2 text-sm text-gray-600'>
          Hesap ID ve e-posta adresinizi girin, size şifre sıfırlama kodu gönderelim.
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <FormInputField
            name='accountId'
            control={control}
            type='text'
            id='accountId'
            size='lg'
            disabled={form.formState.isSubmitting}
            placeholder='Hesap ID giriniz'
            Icon={User}
          />

          <FormInputField
            name='email'
            control={control}
            type='email'
            id='email'
            size='lg'
            disabled={form.formState.isSubmitting}
            placeholder='E-posta giriniz'
            Icon={Mail}
          />

          <LoadingButton
            className='w-full'
            isLoading={form.formState.isSubmitting}
            size='lg'
            loadingText='Gönderiliyor...'
          >
            Şifre Sıfırlama Kodu Gönder
          </LoadingButton>
        </form>
      </FormProvider>

      <div className='text-center'>
        <Link href='/login' className='text-primary flex items-center justify-center gap-1 text-sm hover:underline'>
          <ArrowLeft className='h-4 w-4' />
          Giriş sayfasına dön
        </Link>
      </div>
    </div>
  )
}

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />
}

export default ForgotPasswordPage
