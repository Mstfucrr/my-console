'use client'

import { Button } from '@/components/ui/button'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useOnboarding } from '../context/OnboardingContext'

interface OnboardingNavigationProps {
  currentStep: number
  totalSteps: number
  onStepChange: (step: number) => void
}

export default function OnboardingNavigation({ currentStep, totalSteps, onStepChange }: OnboardingNavigationProps) {
  const { isStepValid, handleSubmit } = useOnboarding()

  const handleNext = async () => {
    if (currentStep === totalSteps - 2) {
      // Last form step, submit the data
      await handleSubmit()
      onStepChange(currentStep + 1)
    } else if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  const isLastStep = currentStep === totalSteps - 1
  const isFormStep = currentStep < totalSteps - 1
  const canProceed = isFormStep ? isStepValid(currentStep) : true

  if (isLastStep) {
    return null // Completion step handles its own navigation
  }

  return (
    <div className='flex items-center justify-between'>
      <Button
        variant='outline'
        onClick={handlePrevious}
        disabled={currentStep === 0}
        className='flex items-center gap-2'
      >
        <ChevronLeft className='h-4 w-4' />
        Önceki
      </Button>

      <Button onClick={handleNext} disabled={!canProceed} className='flex items-center gap-2' color='primary'>
        {currentStep === totalSteps - 2 ? 'Tamamla' : 'Sonraki'}
        {currentStep < totalSteps - 2 && <ChevronRight className='h-4 w-4' />}
        {currentStep === totalSteps - 2 && <Check className='h-4 w-4' />}
      </Button>
    </div>
  )
}
