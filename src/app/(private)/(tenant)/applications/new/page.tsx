'use client'
import { StoreApplicationMaintenancePage } from '@/components/store-application-maintenance-page'
import { canSubmitStoreApplication, isActiveTenant } from '@/lib/permissions'
import { CreateStoreApplicationView } from '@/modules/tenant/applications/create'

export default function NewApplicationPage() {
  const isNewStoreApplicationInMaintenance = isActiveTenant && !canSubmitStoreApplication

  if (isNewStoreApplicationInMaintenance) return <StoreApplicationMaintenancePage />

  return <CreateStoreApplicationView />
}
