'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, CheckCircle, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

// Regex patterns centralized for reusability
const PASSWORD_REGEXES = {
  lowercase: { regex: /[a-z]/, message: 'Şifre en az bir küçük harf içermelidir.' },
  uppercase: { regex: /[A-Z]/, message: 'Şifre en az bir büyük harf içermelidir.' },
  number: { regex: /\d/, message: 'Şifre en az bir rakam içermelidir.' }
}

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Şifre en az 8 karakter olmalıdır.' })
      .regex(PASSWORD_REGEXES.lowercase.regex, { message: PASSWORD_REGEXES.lowercase.message })
      .regex(PASSWORD_REGEXES.uppercase.regex, { message: PASSWORD_REGEXES.uppercase.message })
      .regex(PASSWORD_REGEXES.number.regex, { message: PASSWORD_REGEXES.number.message }),
    confirmPassword: z.string().min(1, { message: 'Şifre tekrarı zorunludur.' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor.',
    path: ['confirmPassword']
  })

type ResetPasswordFormType = z.infer<typeof schema>

function ResetPasswordFormInner() {
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

  // Centralized password checks for reusability
  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' })
  const isLengthValid = passwordValue.length >= 8
  const hasUppercase = PASSWORD_REGEXES.uppercase.regex.test(passwordValue)
  const hasLowercase = PASSWORD_REGEXES.lowercase.regex.test(passwordValue)
  const hasNumber = PASSWORD_REGEXES.number.regex.test(passwordValue)

  const isValid = isLengthValid && hasUppercase && hasLowercase && hasNumber

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

  const reqItem = (ok: boolean, content: React.ReactNode) => (
    <span className={ok ? 'text-green-700' : 'text-primary'}>
      {ok ? '✔' : '•'} {content}
      <br />
    </span>
  )

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
              type='password'
              id='password'
              size='lg'
              disabled={isLoading}
              placeholder='Şifrenizi giriniz'
              Icon={Lock}
            />
          </div>

          <div className='relative'>
            <FormInputField
              name='confirmPassword'
              control={control}
              type='password'
              id='confirmPassword'
              size='lg'
              disabled={isLoading}
              placeholder='Şifrenizi tekrar girin'
              Icon={Lock}
            />
          </div>

          <div className={cn('rounded-lg bg-blue-50 p-3', isValid ? 'bg-green-50' : 'bg-blue-50')}>
            <p className='text-xs'>
              <strong className={cn(isValid ? 'text-green-700' : 'text-primary')}>Şifre gereksinimleri:</strong>
              <br />
              {reqItem(isLengthValid, 'En az 8 karakter')}
              {reqItem(hasUppercase, 'En az bir büyük harf (A-Z)')}
              {reqItem(hasLowercase, 'En az bir küçük harf (a-z)')}
              {reqItem(hasNumber, 'En az bir rakam (0-9)')}
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

const ResetPasswordForm = () => (
  <Suspense fallback={<div className='py-8 text-center'>Yükleniyor...</div>}>
    <ResetPasswordFormInner />
  </Suspense>
)

const ResetPasswordPage = () => {
  return <ResetPasswordForm />
}

export default ResetPasswordPage
