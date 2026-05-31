'use client'

import { SiteLogoBig } from '@/components/svg'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { BUSINESS_SETUP_STEPPER_LABELS, BusinessSetupStep } from '../constants'
import { useBusinessSetup } from '../context/business-setup-context'
import {
  BusinessInfoStep,
  BusinessSetupApplicationProcessStep,
  BusinessSetupIntroStep,
  BusinessSetupPartnerBenefitsStep
} from './business-setup-steps'

function BusinessSetupStepper() {
  const { step } = useBusinessSetup()

  return (
    <nav aria-label='İşletme kurulum adımları' className='mx-auto flex flex-wrap items-center justify-center gap-2'>
      {BUSINESS_SETUP_STEPPER_LABELS.map((label, index) => {
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

function BusinessSetupFooterDots() {
  const { step } = useBusinessSetup()

  return (
    <div className='flex items-center gap-2' role='tablist' aria-label='Adım göstergesi'>
      {BUSINESS_SETUP_STEPPER_LABELS.map((_, i) => (
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

function BusinessSetupFooterNav() {
  const { step, goBack, goNext, goToBusinessInfoStep } = useBusinessSetup()
  const isBusinessInfoStep = step === BusinessSetupStep.BusinessInfo

  return (
    <footer className='border-border shrink-0 border-t'>
      <div className='flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8'>
        <BusinessSetupFooterDots />
        <div className='flex flex-wrap items-center justify-end gap-2 sm:gap-3'>
          {!isBusinessInfoStep && (
            <>
              {step > BusinessSetupStep.Intro && (
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
              {step < BusinessSetupStep.ApplicationProcess && (
                <Button
                  type='button'
                  data-testid='business-setup-next-button'
                  color='primary'
                  size='sm'
                  onClick={goNext}
                  aria-label='Sonraki adım'
                >
                  İleri
                  <ArrowRight className='size-4' />
                </Button>
              )}
              {step === BusinessSetupStep.ApplicationProcess && (
                <Button
                  type='button'
                  data-testid='business-setup-start-button'
                  color='primary'
                  size='sm'
                  onClick={goToBusinessInfoStep}
                  aria-label='İşletme bilgileri adımına geç'
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

export function BusinessSetupShell() {
  const { step } = useBusinessSetup()
  const isBusinessInfoStep = step === BusinessSetupStep.BusinessInfo

  return (
    <div className='flex items-center justify-center px-2 max-sm:items-baseline sm:p-6'>
      <motion.div
        layout
        transition={{ layout: { duration: 0.2 } }}
        className='bg-card text-card-foreground border-border flex h-[680px] max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border object-top shadow-md max-sm:max-h-[calc(100vh-1rem)]'
        role='region'
        aria-label='İşletme kurulumu'
      >
        <header className='border-border shrink-0 border-b'>
          <div className='flex flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-8'>
            <div className='text-primary flex shrink-0 items-center justify-center md:-mr-20 lg:justify-start'>
              <span className='sr-only'>fiyuu</span>
              <SiteLogoBig className='h-7 w-auto sm:h-10' aria-hidden />
            </div>
            <BusinessSetupStepper />
          </div>
          <div className='bg-primary h-0.5 w-full' aria-hidden />
        </header>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className={cn(
            'min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-6 lg:px-8',
            !isBusinessInfoStep && 'md:content-center'
          )}
        >
          {step === BusinessSetupStep.Intro && <BusinessSetupIntroStep />}
          {step === BusinessSetupStep.PartnerBenefits && <BusinessSetupPartnerBenefitsStep />}
          {step === BusinessSetupStep.ApplicationProcess && <BusinessSetupApplicationProcessStep />}
          {isBusinessInfoStep && (
            <div className='mx-auto w-full max-w-3xl'>
              <BusinessInfoStep />
            </div>
          )}
        </motion.div>

        <BusinessSetupFooterNav />
      </motion.div>
    </div>
  )
}
