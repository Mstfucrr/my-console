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
  accountId: z.string().optional(),
  identifier: z.string().min(1, { message: 'E-posta zorunludur.' }),
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
    <div className='flex w-full flex-col gap-8'>
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
            placeholder='Hesap ID (Şubeler için zorunludur)'
          />
          <FormInputField
            name='identifier'
            control={control}
            type='text'
            id='identifier'
            size='lg'
            disabled={loadingState.login}
            Icon={Mail}
            placeholder='E-posta'
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
            placeholder='Şifre'
          />

          <AuthTurnstile turnstileState={turnstileState} />

          <div className='flex justify-end'>
            <Link href='/forgot-password' className='text-primary text-sm hover:underline'>
              Şifremi unuttum
            </Link>
          </div>

          <LoadingButton
            type='submit'
            className='w-full'
            isLoading={loadingState.login}
            size='md'
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
