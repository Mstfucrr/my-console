'use client'
import { useIsDesktop } from '@/hooks/use-media-query'
import dynamic from 'next/dynamic'

const Topbar = dynamic(() => import('./topbar'), { ssr: false })
const MobileSidebar = dynamic(() => import('./mobile-sidebar'), { ssr: false })

const Sidebar = () => {
  const isDesktop = useIsDesktop()

  if (!isDesktop) return <MobileSidebar />

  return <Topbar />
}

export default Sidebar
