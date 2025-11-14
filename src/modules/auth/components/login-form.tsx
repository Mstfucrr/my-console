'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { LoadingButton } from '@/components/ui/loading-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { authService } from '../service/auth.service'
import { ILoginRequest, ILoginResponse } from '../types'

const schema = z.object({
  accountId: z.string().min(1, { message: 'Hesap ID zorunludur.' }),
  identifier: z.string().min(1, { message: 'E-posta veya kullanıcı adı zorunludur.' }),
  password: z.string().min(1, { message: 'Şifre zorunludur.' })
})

type LoginFormType = z.infer<typeof schema>

interface LogInFormProps {
  onOtpRequired: (loginData: ILoginResponse) => void
}

const LogInForm = ({ onOtpRequired }: LogInFormProps) => {
  const { mutateAsync: login, isPending: loginPending } = useMutation({
    mutationFn: (request: ILoginRequest) => authService.login(request)
  })

  const form = useForm<LoginFormType>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      accountId: 'fiyuu',
      identifier: 'efsane@fiyuu.com.tr',
      password: '11111-222224!'
    }
  })

  const { handleSubmit, control } = form

  const router = useRouter()

  const onSubmit = async (data: LoginFormType) => {
    try {
      const loginResponse = await login(data)

      if (loginResponse.requiresOtp) return onOtpRequired(loginResponse)
      else {
        toast.success('Başarılıyla giriş yaptınız.')
        router.push('/')
      }
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
            name='accountId'
            control={control}
            type='text'
            id='accountId'
            size='lg'
            disabled={loginPending}
            Icon={User}
            placeholder='Hesap ID giriniz'
          />
          <FormInputField
            name='identifier'
            control={control}
            type='text'
            id='identifier'
            size='lg'
            disabled={loginPending}
            Icon={Mail}
            placeholder='E-posta veya kullanıcı adı giriniz'
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
