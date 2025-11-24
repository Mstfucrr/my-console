'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { LoadingButton } from '@/components/ui/loading-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, User } from 'lucide-react'
import { Turnstile } from 'next-turnstile'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '../context/auth-context'

const schema = z.object({
  accountId: z.string().min(1, { message: 'Hesap ID zorunludur.' }),
  identifier: z.string().min(1, { message: 'E-posta veya kullanıcı adı zorunludur.' }),
  password: z.string().min(1, { message: 'Şifre zorunludur.' })
})

type LoginFormType = z.infer<typeof schema>

const LogInForm = () => {
  const { handleLogin, loadingState } = useAuth()
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const form = useForm<LoginFormType>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      accountId: '',
      identifier: '',
      password: ''
    }
  })

  const { handleSubmit, control } = form

  const onSubmit = async (data: LoginFormType) => {
    await handleLogin({ ...data, turnstileToken: turnstileToken ?? '' })
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
            disabled={loadingState.login}
            Icon={User}
            placeholder='Hesap ID giriniz'
          />
          <FormInputField
            name='identifier'
            control={control}
            type='text'
            id='identifier'
            size='lg'
            disabled={loadingState.login}
            Icon={Mail}
            placeholder='E-posta veya kullanıcı adı giriniz'
          />
          <FormInputField
            name='password'
            control={control}
            type='password'
            id='password'
            size='lg'
            disabled={loadingState.login}
            Icon={Lock}
            placeholder='Şifrenizi giriniz'
          />

          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY} theme='light' onVerify={setTurnstileToken} />

          <div className='flex justify-end'>
            <Link href='/forgot-password' className='text-primary text-sm hover:underline'>
              Şifremi unuttum?
            </Link>
          </div>

          <LoadingButton
            className='w-full'
            isLoading={loadingState.login}
            size='lg'
            loadingText='Giriş Yapılıyor...'
            disabled={!turnstileToken}
          >
            Giriş Yap
          </LoadingButton>
        </form>
      </FormProvider>
    </div>
  )
}

export default LogInForm
