'use client'
import { FormCheckboxField } from '@/components/form/FormCheckboxField'
import { FormInputField } from '@/components/form/FormInputField'
import { FormPhoneField } from '@/components/form/FormPhoneField'
import { TooltippedElement } from '@/components/tooltipped-element'
import { Form } from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import type { OnboardingStepCompletedEvent } from '@/lib/analytics/types'
import { MOBILE_PHONE_REGEX, ONLY_LETTERS_REGEX, VKN_REGEX } from '@/lib/regex'
import { AuthTurnstile } from '@/modules/auth/components/turnstile'
import { useTurnstile } from '@/modules/auth/hooks/useTurnstile'
import { useOnboarding } from '@/modules/tenant/onboarding/context/OnboardingContext'
import { IdCard, InfoIcon, Mail, Phone, User } from 'lucide-react'
import { useFormState } from 'react-hook-form'
import { OnboardingContactFormValues } from '../constants'

export function ContactInformationStep() {
  const {
    onboardingContactForm: form,
    requestApplicationSession,
    isRequestingApplicationSession,
    goToVerification
  } = useOnboarding()
  const turnstileState = useTurnstile()

  const { isSubmitted, errors } = useFormState({ control: form.control })
  const hasAnyEmptyField = isSubmitted && Object.values(errors).some(error => error?.message === '')

  const onSubmit = async (data: OnboardingContactFormValues) => {
    try {
      const response = await requestApplicationSession(data, turnstileState.token ?? undefined)
      if (response) {
        track<OnboardingStepCompletedEvent>(ANALYTICS_EVENTS.onboardingStepCompleted, {
          step: 'contact',
          status: 'success'
        })
        goToVerification()
      } else {
        track<OnboardingStepCompletedEvent>(ANALYTICS_EVENTS.onboardingStepCompleted, {
          step: 'contact',
          status: 'failed'
        })
      }
    } catch {
      turnstileState.resetToken()
      track<OnboardingStepCompletedEvent>(ANALYTICS_EVENTS.onboardingStepCompleted, {
        step: 'contact',
        status: 'failed'
      })
    }
  }

  const turnstileTokenIsValid = turnstileState.isValid || process.env.NODE_ENV === 'development'

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <div className='text-primary-700 mb-0.5 flex items-center gap-2 text-base font-medium'>
          <h3>Şirket Yetkilisi Bilgileri</h3>
          <TooltippedElement
            className='max-w-52'
            side='bottom'
            tooltipContent='Şirket yetkili bilgileri imza sirkülerinde yer alan kişi bilgilerine ait olmalıdır. Bilgilerin doğru ve eksiksiz olduğundan emin olunuz. Girilen bilgiler, Partner hesabınıza erişim ve giriş işlemleri için kullanılacaktır.'
          >
            <InfoIcon className='text-primary-700 size-4' />
          </TooltippedElement>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-x-4 gap-y-3 text-left'>
          <FormInputField
            Icon={User}
            name='firstName'
            autoFocus
            autoComplete='off'
            size='lg'
            placeholder='Ad'
            control={form.control}
            regexPattern={ONLY_LETTERS_REGEX}
            autoFirstLetterUppercase
          />
          <FormInputField
            Icon={User}
            name='surname'
            autoComplete='off'
            size='lg'
            placeholder='Soyad'
            control={form.control}
            regexPattern={ONLY_LETTERS_REGEX}
            autoFirstLetterUppercase
          />
          <FormPhoneField
            required
            Icon={Phone}
            name='phoneNumber'
            customMask='(500) 000-0000'
            control={form.control}
            placeholder='(532) 123-4567'
            size='lg'
            regexPattern={MOBILE_PHONE_REGEX}
          />
          <FormInputField
            Icon={Mail}
            name='email'
            autoComplete='off'
            size='lg'
            placeholder='E-posta'
            control={form.control}
            regexPattern={/^[^\s]+$/}
          />
          <FormInputField
            Icon={IdCard}
            name='taxNumber'
            autoComplete='off'
            size='lg'
            placeholder='VKN'
            control={form.control}
            regexPattern={VKN_REGEX}
            inputMode='numeric'
            pattern='[0-9]*'
          />

          <FormCheckboxField
            name='kvkkAccepted'
            includeLabel={false}
            control={form.control}
            label={
              <span className='text-sm'>
                <a
                  href='/kvkk/Kişisel Verilerin Korunumu.pdf'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary underline underline-offset-2'
                >
                  KVKK Sözleşmesi
                </a>{' '}
                okudum, anladım ve kabul ediyorum.
              </span>
            }
            size='sm'
          />

          <AuthTurnstile turnstileState={turnstileState} />

          {hasAnyEmptyField && <p className='text-sm text-red-500'>Lütfen zorunlu alanları doldurunuz.</p>}

          <LoadingButton
            type='submit'
            size='md'
            className='w-full'
            isLoading={form.formState.isSubmitting || isRequestingApplicationSession}
            loadingText='Kaydediliyor...'
            disabled={!turnstileTokenIsValid}
          >
            Devam Et
          </LoadingButton>
        </form>
      </Form>
    </div>
  )
}
