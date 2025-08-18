import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ONBOARDING_STEPS } from '../data'
import OnboardingNavigation from './OnboardingNavigation'
import AddressInfoStep from './steps/AddressInfoStep'
import BankInfoStep from './steps/BankInfoStep'
import CompanyInfoStep from './steps/CompanyInfoStep'
import CompletionStep from './steps/CompletionStep'
import ContactInfoStep from './steps/ContactInfoStep'

interface OnboardingStepsProps {
  currentStep: number
  onStepChange: (step: number) => void
}

export default function OnboardingSteps({ currentStep, onStepChange }: OnboardingStepsProps) {
  const stepComponents = [CompanyInfoStep, AddressInfoStep, ContactInfoStep, BankInfoStep, CompletionStep]

  const CurrentStepComponent = stepComponents[currentStep]

  return (
    <Card
      className={cn('flex h-140 flex-col justify-between gap-4 p-4 sm:p-6', {
        'h-auto !p-0': currentStep === ONBOARDING_STEPS.length - 1
      })}
    >
      <CurrentStepComponent />

      {/* Navigation */}
      <OnboardingNavigation
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        onStepChange={onStepChange}
      />
    </Card>
  )
}
