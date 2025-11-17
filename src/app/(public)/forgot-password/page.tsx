'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { LoadingButton } from '@/components/ui/loading-button'
import { authService } from '@/modules/auth/service/auth.service'
import { IPasswordRecoveryRequest } from '@/modules/auth/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const schema = z.object({
  accountId: z.string().min(1, { message: 'Hesap ID zorunludur.' }),
  email: z.string().min(1, { message: 'E-posta zorunludur.' }).email({ message: 'Geçerli bir e-posta giriniz.' })
})

type ForgotPasswordFormType = z.infer<typeof schema>

const ForgotPasswordForm = () => {
  const router = useRouter()
  const { mutateAsync: passwordRecover } = useMutation({
    mutationFn: (request: IPasswordRecoveryRequest) => authService.passwordRecovery(request)
  })

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
      const response = await passwordRecover({
        accountId: data.accountId,
        email: data.email
      })

      toast.success('Şifre sıfırlama kodu e-posta adresinize gönderildi.')
      router.push(`/reset-password?recoverySessionId=${response.recoverySessionId}`)
    } catch (error) {
      console.error('forgot password error', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
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
