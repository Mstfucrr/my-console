'use client'

import { TenantModuleMaintenancePage } from '@/components/tenant-module-maintenance-page'
import { useProfile } from '@/context/ProfileProvider'
import { isTenantModuleAvailable } from '@/lib/permissions'

export default function TenantSegmentLayout({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile()
  const canTenantAccess = isTenantModuleAvailable(profile)

  if (!canTenantAccess) return <TenantModuleMaintenancePage />

  return <>{children}</>
}
