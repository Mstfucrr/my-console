'use client'
import { useIsMobile } from '@/hooks/use-media-query'
import dynamic from 'next/dynamic'

const Topbar = dynamic(() => import('./topbar'), { ssr: false })
const MobileMenu = dynamic(() => import('./mobile-menu'), { ssr: false })

const Sidebar = () => {
  const isMobile = useIsMobile()

  if (isMobile) return <MobileMenu />

  return <Topbar />
}

export default Sidebar
