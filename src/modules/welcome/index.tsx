import { WelcomeOnboardingShell } from './components/welcome-onboarding-shell'
import { WelcomeOnboardingProvider } from './context/welcome-onboarding-context'

export function WelcomeOnboardingView() {
  return (
    <WelcomeOnboardingProvider>
      <WelcomeOnboardingShell />
    </WelcomeOnboardingProvider>
  )
}
