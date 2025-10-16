'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { LoadingButton } from '@/components/ui/loading-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { useAuthContext } from '../context/AuthContext'

const schema = z.object({
  email: z.string().min(1, { message: 'E-posta zorunludur.' }).email({ message: 'Geçerli bir e-posta giriniz.' }),
  password: z.string().min(1, { message: 'Şifre zorunludur.' })
})

type LoginFormType = z.infer<typeof schema>

const LogInForm = () => {
  const {
    loginMutation: { mutateAsync: login, isPending: loginPending },
    handleOtp
  } = useAuthContext()

  const form = useForm<LoginFormType>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      email: 'efsane@fiyuu.com.tr',
      password: '11111-222224!'
    }
  })

  const { handleSubmit, control } = form

  const router = useRouter()

  const onSubmit = async (data: LoginFormType) => {
    try {
      const { otp } = await login(data)
      if (otp) handleOtp()
      else router.push('/')
    } catch (error) {
      console.error('login error', error)
      toast.error('Giriş bilgileri hatalı. Lütfen tekrar deneyiniz.')
    }
  }

  return (
    <div className='w-full space-y-4'>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 text-left'>
          <FormInputField
            name='email'
            control={control}
            type='email'
            id='email'
            size='lg'
            disabled={loginPending}
            Icon={Mail}
            placeholder='E-posta giriniz'
          />
          <FormInputField
            name='password'
            control={control}
            type='password'
            id='password'
            size='lg'
            disabled={loginPending}
            Icon={Lock}
            placeholder='Şifrenizi giriniz'
          />

          <div className='flex justify-end'>
            <Link href='/forgot-password' className='text-primary text-sm hover:underline'>
              Şifremi unuttum?
            </Link>
          </div>

          <LoadingButton className='w-full' isLoading={loginPending} size='lg' loadingText='Giriş Yapılıyor...'>
            Giriş Yap
          </LoadingButton>
        </form>
      </FormProvider>
    </div>
  )
}

export default LogInForm
