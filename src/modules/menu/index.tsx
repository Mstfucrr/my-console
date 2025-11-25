'use client'
import { useIsSmallerThanTablet } from '@/hooks/use-media-query'
import { MobileMenu } from './mobile-menu'
import { Topbar } from './topbar'

export function TopbarAndMobileMenu() {
  const isSmallerThanTablet = useIsSmallerThanTablet()

  if (isSmallerThanTablet) return <MobileMenu />

  return <Topbar />
}
