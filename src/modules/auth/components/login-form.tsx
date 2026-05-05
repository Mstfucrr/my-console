'use client'
import { FormInputField } from '@/components/form/FormInputField'
import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { AccountType } from '@/types/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { FormProvider, useController, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '../context/auth-context'
import { useTurnstile } from '../hooks/useTurnstile'
import { AuthTurnstile } from './turnstile'

const ACCOUNT_TYPES: Array<{ value: AccountType; label: string; tooltip: string }> = [
  { value: 'store', label: 'Şube', tooltip: 'Şubenin siparişlerini takip et' },
  { value: 'tenant', label: 'İşletme', tooltip: 'Tüm şubelerini yönet' }
]

const schema = z
  .object({
    accountType: z.enum(['tenant', 'store'], { required_error: 'Hesap türü zorunludur.' }).default('store'),
    accountId: z.string().optional(),
    identifier: z.string().min(1, { message: 'E-posta zorunludur.' }),
    password: z.string().min(1, { message: 'Şifre zorunludur.' })
  })
  .superRefine((data, ctx) => {
    if (data.accountType === 'store' && !data.accountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Hesap ID zorunludur.',
        path: ['accountId']
      })
    }
  })

type LoginFormType = z.infer<typeof schema>

export function LoginForm() {
  const { handleLogin, loadingState } = useAuth()
  const turnstileState = useTurnstile()

  const form = useForm<LoginFormType>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      accountType: 'store',
      accountId: '',
      identifier: '',
      password: ''
    }
  })

  const { handleSubmit, control, setValue } = form

  const {
    field: accountTypeField,
    fieldState: { error: accountTypeError }
  } = useController({ name: 'accountType', control })

  const handleAccountTypeChange = (next: AccountType) => {
    accountTypeField.onChange(next)
    if (next === 'tenant') setValue('accountId', undefined)
  }

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
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-3 text-left'>
          <div className='flex w-full flex-col gap-2'>
            <div className='flex w-full items-center justify-between gap-2'>
              {ACCOUNT_TYPES.map(item => (
                <TooltippedElement
                  key={item.value}
                  tooltipContent={item.tooltip}
                  side='top'
                  className='max-w-52 text-center text-xs'
                >
                  <Button
                    type='button'
                    data-testid={`login-form-account-type-button-${item.value}`}
                    variant={item.value === accountTypeField.value ? undefined : 'outline'}
                    size='sm'
                    color='primary'
                    className={cn('flex-1 text-sm', accountTypeError && 'border-destructive')}
                    onClick={() => handleAccountTypeChange(item.value)}
                  >
                    {item.label}
                  </Button>
                </TooltippedElement>
              ))}
            </div>
            {accountTypeError && (
              <p className='text-destructive px-1 text-xs leading-none'>{accountTypeError.message}</p>
            )}
          </div>
          <AnimatePresence mode='wait'>
            {accountTypeField.value === 'store' && (
              <motion.div
                initial={{ opacity: 0, y: -20, maxHeight: 0 }}
                animate={{ opacity: 1, y: 0, maxHeight: 120 }}
                exit={{ opacity: 0, y: -20, maxHeight: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FormInputField
                  autoFocus
                  name='accountId'
                  control={control}
                  type='text'
                  id='accountId'
                  size='lg'
                  disabled={loadingState.login}
                  Icon={User}
                  placeholder='Hesap ID'
                />
              </motion.div>
            )}
          </AnimatePresence>
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
