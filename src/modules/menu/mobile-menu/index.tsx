'use client'
import { SiteLogoBig } from '@/components/svg'
import { useIsDesktop } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/menu'
import Link from 'next/link'
import { useEffect } from 'react'
import { LogoutButton } from '../common/logout-button'
import { NotificationsPopover } from '../common/notifications-popover'
import { SupportDialog } from '../common/support-dialog'

export function MobileMenu() {
  const { mobileMenu, setMobileMenu } = useSidebar()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (isDesktop) setMobileMenu(false)
  }, [isDesktop, setMobileMenu])

  return (
    <>
      <div
        className={cn(
          'fixed top-0 z-50 flex w-full items-center justify-between px-4 py-3',
          mobileMenu ? 'bg-primary-10' : 'bg-background'
        )}
      >
        <Link href='/' aria-label='Home'>
          <SiteLogoBig className='text-primary w-32' />
        </Link>

        <div className='flex items-center gap-4'>
          <NotificationsPopover />
          <LogoutButton />
        </div>
      </div>
      <div className='fixed right-5 bottom-24 z-50'>
        <SupportDialog />
      </div>
    </>
  )
}
