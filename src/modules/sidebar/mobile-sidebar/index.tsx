'use client'
import { SiteLogoBig } from '@/components/svg'
import { Button } from '@/components/ui/button'
import { useIsDesktop } from '@/hooks/use-media-query'
import { menusConfig } from '@/modules/sidebar/menus'
import { useSidebar } from '@/store/sidebar'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import SidebarContent from '../common/sidebar-content'
import UserMenu from '../topbar/user-menu'

const MobileSidebar = () => {
  const { mobileMenu, setMobileMenu } = useSidebar()
  const menus = menusConfig?.sidebarNav || []

  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (isDesktop) setMobileMenu(false)
  }, [isDesktop])

  return (
    <>
      <motion.div
        variants={{ hidden: { height: 0, opacity: 0 }, visible: { height: 'auto', opacity: 1 } }}
        initial='hidden'
        animate={mobileMenu ? 'visible' : 'hidden'}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className='bg-primary-10 fixed top-14 z-50 w-full overflow-hidden shadow-md backdrop-blur-xl'
      >
        <div className='max-h-[70vh] overflow-y-auto pt-2'>
          <SidebarContent menus={menus} />
        </div>
      </motion.div>

      <div className='bg-primary-10 fixed top-0 z-50 flex w-full items-center justify-between px-4 py-3'>
        <Link href='/' aria-label='Home'>
          <SiteLogoBig className='text-primary w-32' />
        </Link>

        <div className='flex items-center gap-2'>
          <UserMenu />
          <Button
            variant='outline'
            size='icon'
            onClick={() => setMobileMenu(!mobileMenu)}
            className='text-primary size-8 cursor-pointer'
            aria-label={mobileMenu ? 'Menüyü kapat' : 'Menüyü aç'}
          >
            {mobileMenu ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className='overlay fixed inset-0 z-40 bg-black/40 opacity-100 backdrop-blur-xs backdrop-filter'
        />
      )}
    </>
  )
}

export default MobileSidebar
