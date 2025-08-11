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
      identifier: 'asd@fiyuu.com.tr',
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
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8 flex flex-col gap-2 2xl:mt-7'>
          <FormInputField
            name='identifier'
            control={control}
            label='Email'
            type='email'
            id='identifier'
            size={!isDesktop2xl ? 'xl' : 'lg'}
            disabled={loginPending}
          />
          <FormInputField
            name='password'
            control={control}
            label='Şifre'
            type='password'
            id='password'
            size={!isDesktop2xl ? 'xl' : 'lg'}
            disabled={loginPending}
          />

          <div className='mt-5 mb-6 flex flex-wrap gap-2'>
            <Link href='/auth/forgot3' className='text-primary flex-none text-sm'>
              Şifremi unuttum?
            </Link>
          </div>
          <LoadingButton
            className='w-full'
            isLoading={loginPending}
            size={!isDesktop2xl ? 'lg' : 'md'}
            loadingText='Giriş Yapılıyor...'
          >
            Giriş Yap
          </LoadingButton>
        </form>
      </FormProvider>
    </div>
  )
}

export default LogInForm
