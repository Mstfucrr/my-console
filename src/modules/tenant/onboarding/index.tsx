'use client'

import { useOnboarding } from '@/modules/tenant/onboarding/context/OnboardingContext'
import { ContactInformationStep } from './views/ContactInformationStep'
import { VerificationStep } from './views/VerificationStep'

export function OnboardingStepContent() {
  const { step, contactData } = useOnboarding()

  if (step === 'ContactInformation') return <ContactInformationStep />
  if (step === 'Verification') {
    const key = contactData ? `${contactData.phoneNumber}-${contactData.email}` : 'no-contact'
    return <VerificationStep key={key} />
  }
  return null
}
