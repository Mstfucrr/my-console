'use client'

import { useState } from 'react'
import OnboardingHeader from './components/OnboardingHeader'
import OnboardingSteps from './components/OnboardingSteps'
import { OnboardingProvider } from './context/OnboardingContext'

export default function OnboardingView() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <OnboardingProvider>
      <div className='bg-default-50 min-h-screen'>
        <div className='container mx-auto flex max-w-3xl flex-col gap-6 pb-6'>
          {/* Header */}
          <div className='text-center'>
            <div className='bg-primary/10 mx-auto mb-3 flex size-10 items-center justify-center rounded-full text-2xl sm:mb-6 sm:size-16 sm:text-3xl'>
              🚀
            </div>
            <h1 className='text-foreground mb-3 text-2xl font-bold sm:text-3xl'>Hoş Geldiniz!</h1>
            <p className='text-muted-foreground text-sm sm:text-lg'>
              Restoranınızı Fiyuu sistemine entegre etmek için birkaç adımda bilgilerinizi tamamlayın
            </p>
          </div>

          {/* Progress */}
          <OnboardingHeader currentStep={currentStep} />

          <OnboardingSteps currentStep={currentStep} onStepChange={setCurrentStep} />
        </div>
      </div>
    </OnboardingProvider>
  )
}
