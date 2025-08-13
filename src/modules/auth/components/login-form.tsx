'use client'
import FormInputField from '@/components/form/FormInputField'
import { LoadingButton } from '@/components/ui/loading-button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { useAuthContext } from '../context/AuthContext'

const schema = z.object({
  identifier: z.string().min(1, { message: 'E-posta zorunludur.' }).email({ message: 'Geçerli bir e-posta giriniz.' }),
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
    mode: 'all',
    defaultValues: {
      identifier: 'efsane@fiyuu.com.tr',
      password: '11111-222224!'
    }
  })

  const { handleSubmit, control } = form

  const isDesktop2xl = useMediaQuery('(max-width: 1530px)')
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
    <div className='w-full'>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <FormInputField
            name='identifier'
            control={control}
            label='Email'
            type='email'
            id='identifier'
            size='lg'
            disabled={loginPending}
          />
          <FormInputField
            name='password'
            control={control}
            label='Şifre'
            type='password'
            id='password'
            size='lg'
            disabled={loginPending}
          />

          <div className='flex justify-end'>
            <Link href='#' className='text-primary text-sm hover:underline'>
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
