import { BusinessSetupShell } from './components/business-setup-shell'
import { BusinessSetupProvider } from './context/business-setup-context'

export function BusinessSetupView() {
  return (
    <BusinessSetupProvider>
      <BusinessSetupShell />
    </BusinessSetupProvider>
  )
}
