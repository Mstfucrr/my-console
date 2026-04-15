'use client'

import { Stepper } from '@/components/stepper'
import { Form } from '@/components/ui/form'
import type { ReactNode } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { APPLICATION_STEPS, StoreApplicationWizardStepIndex } from '../constants'
import { useStoreApplicationWizard } from '../context/StoreApplicationWizardContext'
import { LocationFields } from './LocationFields'
import { StoreDetailsFields } from './StoreDetailsFields'
import { WizardFooter } from './WizardFooter'
import { WorkingHoursFields } from './WorkingHoursFields'

type WizardStepFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  children: ReactNode
  onSubmit: () => Promise<void>
  footerProps: React.ComponentProps<typeof WizardFooter>
}

function WizardStepForm<T extends FieldValues>({ form, children, onSubmit, footerProps }: WizardStepFormProps<T>) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void onSubmit()
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='space-y-6' autoComplete='off'>
        {children}
        <WizardFooter {...footerProps} />
      </form>
    </Form>
  )
}

function WizardShellStepContent() {
  const { stepIndex, locationForm, branchForm, workingHoursForm, goNext, goBack, submitFinal, isSubmitting } =
    useStoreApplicationWizard()

  if (stepIndex === StoreApplicationWizardStepIndex.Location) {
    return (
      <WizardStepForm
        form={locationForm}
        onSubmit={goNext}
        footerProps={{ primaryLabel: 'Devam Et', primaryType: 'submit' }}
      >
        <LocationFields />
      </WizardStepForm>
    )
  }

  if (stepIndex === StoreApplicationWizardStepIndex.Branch) {
    return (
      <WizardStepForm
        form={branchForm}
        onSubmit={goNext}
        footerProps={{ onBack: goBack, primaryLabel: 'Devam Et', primaryType: 'submit' }}
      >
        <StoreDetailsFields />
      </WizardStepForm>
    )
  }

  if (stepIndex === StoreApplicationWizardStepIndex.WorkingHours) {
    return (
      <WizardStepForm
        form={workingHoursForm}
        onSubmit={submitFinal}
        footerProps={{
          onBack: goBack,
          primaryLabel: 'Kaydet',
          primaryType: 'submit',
          isPrimaryLoading: isSubmitting
        }}
      >
        <WorkingHoursFields />
      </WizardStepForm>
    )
  }

  return null
}

export function WizardShell() {
  const { activeMainStep } = useStoreApplicationWizard()

  return (
    <div className='flex flex-col gap-6 pb-8 max-sm:p-0'>
      <Stepper items={[...APPLICATION_STEPS]} activeKey={activeMainStep} />
      <WizardShellStepContent />
    </div>
  )
}
