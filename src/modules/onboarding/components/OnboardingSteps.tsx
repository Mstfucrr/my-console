import { Card } from '@/components/ui/card'
import AddressInfoStep from './steps/AddressInfoStep'
import BankInfoStep from './steps/BankInfoStep'
import CompanyInfoStep from './steps/CompanyInfoStep'
import CompletionStep from './steps/CompletionStep'
import ContactInfoStep from './steps/ContactInfoStep'

interface OnboardingStepsProps {
  currentStep: number
  onStepChange: (step: number) => void
}

export default function OnboardingSteps({ currentStep }: OnboardingStepsProps) {
  const stepComponents = [CompanyInfoStep, AddressInfoStep, ContactInfoStep, BankInfoStep, CompletionStep]

  const CurrentStepComponent = stepComponents[currentStep]

  return (
    <Card className='p-8'>
      <CurrentStepComponent />
    </Card>
  )
}
