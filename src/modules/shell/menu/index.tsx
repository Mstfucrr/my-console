'use client'
import { useProfile } from '@/context/ProfileProvider'
import { useIsSmallerThanTablet } from '@/hooks/use-media-query'
import { isActiveTenant, isTenantUser } from '@/lib/permissions'
import { usePathname } from 'next/navigation'
import { BottomNavigation } from './bottom-navigation'
import { ProfileButton } from './common/profile-button'
import { SupportDialog } from './common/support-dialog'
import { Topbar } from './topbar'

export function TopbarAndMobileMenu() {
  const { profile } = useProfile()
  const pathname = usePathname()
  const isSmallerThanTablet = useIsSmallerThanTablet()

  const isBusinessSetupPage = pathname === '/business-setup'
  const isMinimalChrome = isBusinessSetupPage || (isTenantUser(profile) && !isActiveTenant)

  if (isMinimalChrome)
    return (
      <>
        <div className='fixed top-5 right-5 z-50'>
          <ProfileButton />
        </div>
        <div className='fixed right-5 bottom-5 z-50'>
          <SupportDialog />
        </div>
      </>
    )

  if (isSmallerThanTablet) return <BottomNavigation />

  return <Topbar />
}
