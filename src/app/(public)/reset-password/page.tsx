'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Şifre en az 8 karakter olmalıdır.' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.'
      }),
    confirmPassword: z.string().min(1, { message: 'Şifre tekrarı zorunludur.' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor.',
    path: ['confirmPassword']
  })

type ResetPasswordFormType = z.infer<typeof schema>

const ResetPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const { handleSubmit, control } = form
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      toast.error('Geçersiz şifre sıfırlama bağlantısı.')
      router.push('/forgot-password')
    }
  }, [token, router])

  const onSubmit = async (data: ResetPasswordFormType) => {
    try {
      setIsLoading(true)
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Password reset for token:', token, 'new password:', data.password)
      setIsSuccess(true)
      toast.success('Şifreniz başarıyla güncellendi.')
    } catch (error) {
      console.error('reset password error', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.')
    } finally {
      setIsLoading(false)
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
        <Link
          href='/login'
          className='inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium'
        >
          <Button color='primary'>
            <ArrowRight className='mr-2 h-4 w-4' /> Giriş Yap
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='w-full space-y-4'>
      <div className='text-center'>
        <h2 className='text-primary text-xl font-bold'>Yeni Şifre Belirle</h2>
        <p className='mt-2 text-sm text-gray-600'>Güvenli bir şifre seçin ve tekrar girin.</p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='relative'>
            <FormInputField
              name='password'
              control={control}
              label='Yeni Şifre'
              type='password'
              id='password'
              size='lg'
              disabled={isLoading}
              placeholder='En az 8 karakter'
            />
          </div>

          <div className='relative'>
            <FormInputField
              name='confirmPassword'
              control={control}
              label='Şifre Tekrarı'
              type='password'
              id='confirmPassword'
              size='lg'
              disabled={isLoading}
              placeholder='Şifrenizi tekrar girin'
            />
          </div>

          <div className='rounded-lg bg-blue-50 p-3'>
            <p className='text-xs text-blue-800'>
              <strong>Şifre gereksinimleri:</strong>
              <br />• En az 8 karakter
              <br />• En az bir büyük harf (A-Z)
              <br />• En az bir küçük harf (a-z)
              <br />• En az bir rakam (0-9)
            </p>
          </div>

          <LoadingButton className='w-full' isLoading={isLoading} size='lg' loadingText='Güncelleniyor...'>
            Şifreyi Güncelle
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

const ResetPasswordPage = () => {
  return <ResetPasswordForm />
}

export default ResetPasswordPage
