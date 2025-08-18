'use client'

import { useState } from 'react'
import OnboardingHeader from './components/OnboardingHeader'
import OnboardingNavigation from './components/OnboardingNavigation'
import OnboardingSteps from './components/OnboardingSteps'
import { OnboardingProvider } from './context/OnboardingContext'
import { ONBOARDING_STEPS } from './data'

export default function OnboardingView() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <OnboardingProvider>
      <div className='bg-default-50 min-h-screen py-8'>
        <div className='container mx-auto flex max-w-4xl flex-col gap-6'>
          {/* Header */}
          <div className='text-center'>
            <div className='bg-primary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-3xl'>
              🚀
            </div>
            <h1 className='text-foreground mb-3 text-3xl font-bold'>Hoş Geldiniz!</h1>
            <p className='text-muted-foreground text-lg'>
              Restoranınızı Fiyuu sistemine entegre etmek için birkaç adımda bilgilerinizi tamamlayın
            </p>
          </div>

          {/* Progress */}
          <OnboardingHeader currentStep={currentStep} />

          <OnboardingSteps currentStep={currentStep} onStepChange={setCurrentStep} />

          {/* Navigation */}
          <OnboardingNavigation
            currentStep={currentStep}
            totalSteps={ONBOARDING_STEPS.length}
            onStepChange={setCurrentStep}
          />
        </div>
      </div>
    </OnboardingProvider>
  )
}
