'use client'
import { useIsDesktop } from '@/hooks/use-media-query'
import dynamic from 'next/dynamic'
import MobileSidebar from './mobile-sidebar'

const Topbar = dynamic(() => import('./topbar'), { ssr: false })

const Sidebar = () => {
  const isDesktop = useIsDesktop()

  if (!isDesktop) return <MobileSidebar />

  return <Topbar />
}

export default Sidebar
