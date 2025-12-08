'use client'
import { useIsDesktop } from '@/hooks/use-media-query'
import { useSidebar } from '@/store/menu'
import { useEffect } from 'react'
import { SupportDialog } from '../common/support-dialog'

export function MobileMenu() {
  const { setMobileMenu } = useSidebar()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (isDesktop) setMobileMenu(false)
  }, [isDesktop, setMobileMenu])

  return (
    <div className='fixed bottom-20 left-5 z-50'>
      <SupportDialog />
    </div>
  )
}
