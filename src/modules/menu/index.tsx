'use client'
import { useIsSmallerThanTablet } from '@/hooks/use-media-query'
import { BottomNavigation } from './bottom-navigation'
import { MobileMenuPopover } from './common/mobile-menu-popover'
import { SupportDialog } from './common/support-dialog'
import { MobileMenu } from './mobile-menu'
import { Topbar } from './topbar'

export function TopbarAndMobileMenu() {
  const isSmallerThanTablet = useIsSmallerThanTablet()

  if (isSmallerThanTablet) {
    return (
      <>
        <MobileMenu />
        <BottomNavigation />
        <div className='fixed bottom-20 left-5 z-50'>
          <SupportDialog />
        </div>
        <div className='fixed top-5 left-5 z-50'>
          <div className='bg-background ring-border flex size-10 items-center justify-center rounded-full shadow-lg ring-2'>
            <MobileMenuPopover />
          </div>
        </div>
      </>
    )
  }

  return <Topbar />
}
