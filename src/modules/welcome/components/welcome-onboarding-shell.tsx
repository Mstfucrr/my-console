'use client'

import { SiteLogoBig } from '@/components/svg'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WELCOME_ONBOARDING_STEPPER_LABELS, WelcomeOnboardingStep } from '@/modules/welcome/constants'
import { useWelcomeOnboarding } from '@/modules/welcome/context/welcome-onboarding-context'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import {
  WelcomeStepApplication,
  WelcomeStepFinancial,
  WelcomeStepIntro,
  WelcomeStepPartner
} from './welcome-onboarding-steps'

function WelcomeStepper() {
  const { step, showFourthStepperItem } = useWelcomeOnboarding()
  const labels = showFourthStepperItem
    ? WELCOME_ONBOARDING_STEPPER_LABELS
    : WELCOME_ONBOARDING_STEPPER_LABELS.slice(0, 3)

  return (
    <nav aria-label='Onboarding adımları' className='mx-auto flex flex-wrap items-center justify-center gap-2'>
      {labels.map((label, index) => {
        const isDone = index < step
        const isActive = index === step

        return (
          <motion.div
            layoutId={`stepper-label-${label}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            key={label}
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:gap-1.5 sm:px-4 sm:text-sm',
              isActive && 'bg-primary text-primary-foreground',
              isDone && !isActive && 'bg-muted text-muted-foreground',
              !isDone && !isActive && 'bg-muted/60 text-muted-foreground'
            )}
            aria-current={isActive ? 'step' : undefined}
          >
            {isDone && <Check className='size-3.5 shrink-0 sm:size-4' aria-hidden />}
            <span>{label}</span>
          </motion.div>
        )
      })}
    </nav>
  )
}

function WelcomeFooterDots() {
  const { step, showFourthStepperItem } = useWelcomeOnboarding()
  const count = showFourthStepperItem ? WELCOME_ONBOARDING_STEPPER_LABELS.length : 3

  return (
    <div className='flex items-center gap-2' role='tablist' aria-label='Adım göstergesi'>
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          layoutId={`footer-dot-${i}`}
          role='tab'
          aria-selected={i === step}
          className={cn('rounded-full', i === step ? 'bg-primary h-2 w-6' : 'bg-default-300 size-2')}
        />
      ))}
    </div>
  )
}

function WelcomeFooterNav() {
  const { step, goBack, goNext, goToFinancialStep } = useWelcomeOnboarding()
  const isFinancialStep = step === WelcomeOnboardingStep.Financial

  return (
    <footer className='border-border shrink-0 border-t'>
      <div className='flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8'>
        <WelcomeFooterDots />
        <div className='flex flex-wrap items-center justify-end gap-2 sm:gap-3'>
          {!isFinancialStep && (
            <>
              {step > WelcomeOnboardingStep.Intro && (
                <Button
                  type='button'
                  variant='outline'
                  color='secondary'
                  size='sm'
                  onClick={goBack}
                  aria-label='Önceki adım'
                >
                  <ArrowLeft className='size-4' />
                  Geri
                </Button>
              )}
              {step < WelcomeOnboardingStep.Application && (
                <Button
                  type='button'
                  data-testid='welcome-onboarding-next-button'
                  color='primary'
                  size='sm'
                  onClick={goNext}
                  aria-label='Sonraki adım'
                >
                  İleri
                  <ArrowRight className='size-4' />
                </Button>
              )}
              {step === WelcomeOnboardingStep.Application && (
                <Button
                  type='button'
                  data-testid='welcome-onboarding-start-button'
                  color='primary'
                  size='sm'
                  onClick={goToFinancialStep}
                  aria-label='Finansal bilgiler adımına geç'
                >
                  Hadi Başlayalım
                  <ArrowRight className='size-4' />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </footer>
  )
}

export function WelcomeOnboardingShell() {
  const { step } = useWelcomeOnboarding()
  const isFinancialStep = step === WelcomeOnboardingStep.Financial

  return (
    <div
      className={cn(
        'bg-muted/40 flex items-center justify-center px-2 max-sm:items-baseline sm:p-6',
        isFinancialStep ? 'max-md:h-screen' : 'h-screen min-h-max'
      )}
    >
      <motion.div
        layout='size'
        transition={{ layout: { duration: 0.3 } }}
        className={cn(
          'bg-card text-card-foreground border-border flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border object-top shadow-md',
          isFinancialStep ? 'h-auto max-w-3xl' : 'h-[680px] max-md:h-full max-sm:h-full'
        )}
        role='region'
        aria-label='Onboarding'
      >
        <header className='border-border shrink-0 border-b'>
          <div
            className={cn(
              'flex flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-8',
              isFinancialStep && 'pr-3!'
            )}
          >
            <div
              className={cn(
                'text-primary flex shrink-0 items-center justify-center md:-mr-20 lg:justify-start',
                isFinancialStep && 'mr-0!'
              )}
            >
              <span className='sr-only'>fiyuu</span>
              <SiteLogoBig className='h-7 w-auto sm:h-10' aria-hidden />
            </div>
            <WelcomeStepper />
          </div>
          <div className='bg-primary h-0.5 w-full' aria-hidden />
        </header>

        <div className='min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-6 md:content-center lg:px-8'>
          {step === WelcomeOnboardingStep.Intro && <WelcomeStepIntro />}
          {step === WelcomeOnboardingStep.Partner && <WelcomeStepPartner />}
          {step === WelcomeOnboardingStep.Application && <WelcomeStepApplication />}
          {isFinancialStep && <WelcomeStepFinancial />}
        </div>

        <WelcomeFooterNav />
      </motion.div>
    </div>
  )
}
