'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { LoadingButton } from '@/components/ui/loading-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '../context/auth-context'
import { useTurnstile } from '../hooks/useTurnstile'
import { AuthTurnstile } from './turnstile'

const schema = z.object({
  accountId: z.string().min(1, { message: 'Hesap ID zorunludur.' }),
  identifier: z.string().min(1, { message: 'E-posta veya kullanıcı adı zorunludur.' }),
  password: z.string().min(1, { message: 'Şifre zorunludur.' })
})

type LoginFormType = z.infer<typeof schema>

export function LoginForm() {
  const { handleLogin, loadingState } = useAuth()
  const turnstileState = useTurnstile()

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
    try {
      await handleLogin({
        ...data,
        turnstileToken: turnstileState.token || undefined
      })
    } catch {
      turnstileState.resetToken()
    }
  }

  return (
    <div className='w-full space-y-4'>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 text-left'>
          <FormInputField
            autoFocus
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
            regexPattern={/^[^\s]+$/}
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

          <AuthTurnstile turnstileState={turnstileState} />

          <div className='flex justify-end'>
            <Link href='/forgot-password' className='text-primary text-sm hover:underline'>
              Şifremi unuttum
            </Link>
          </div>

          <LoadingButton
            className='w-full'
            isLoading={loadingState.login}
            size='lg'
            loadingText='Giriş Yapılıyor...'
            disabled={!turnstileState.isValid}
          >
            Giriş Yap
          </LoadingButton>
        </form>
      </FormProvider>
    </div>
  )
}
