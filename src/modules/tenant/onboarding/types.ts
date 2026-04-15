export type OnboardingStep = 'ContactInformation' | 'Verification'

export type VerifiedContactSnapshot = {
  phoneNumber?: string
  email?: string
}
