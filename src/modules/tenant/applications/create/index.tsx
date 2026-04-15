'use client'

import { StoreApplicationWizardProvider } from './context/StoreApplicationWizardContext'
import { WizardShell } from './components/WizardShell'

export function CreateStoreApplicationView() {
  return (
    <StoreApplicationWizardProvider>
      <WizardShell />
    </StoreApplicationWizardProvider>
  )
}
