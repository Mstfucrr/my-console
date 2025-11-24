'use client'
import { useIsSmallerThanTablet } from '@/hooks/use-media-query'
import { MobileMenu } from './mobile-menu'
import { Topbar } from './topbar'

const Sidebar = () => {
  const isSmallerThanTablet = useIsSmallerThanTablet()

  if (isSmallerThanTablet) return <MobileMenu />

  return <Topbar />
}

export default Sidebar
