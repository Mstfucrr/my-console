'use client'
import { SiteLogoBig } from '@/components/svg'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsDesktop } from '@/hooks/use-media-query'
import { menusConfig } from '@/modules/menu/menus'
import { useSidebar } from '@/store/sidebar'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { MenuItem } from '../common/menu-item'
import { NotificationsPopover } from '../common/notifications-popover'
import { SupportDialog } from '../common/support-dialog'
import UserMenu from '../common/user-menu'

const MobileMenu = () => {
  const { mobileMenu, setMobileMenu } = useSidebar()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (isDesktop) setMobileMenu(false)
  }, [isDesktop, setMobileMenu])

  return (
    <>
      <motion.div
        variants={{ hidden: { height: 0 }, visible: { height: 'auto' } }}
        initial='hidden'
        animate={mobileMenu ? 'visible' : 'hidden'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='bg-primary-10 fixed top-14 z-50 w-full overflow-hidden shadow-md backdrop-blur-xl'
      >
        <div className='overflow-y-auto pt-2'>
          <div className='flex h-full w-full flex-col pb-5'>
            <ScrollArea className='mt-2 max-h-[calc(100%-100px)] flex-1 px-4 pb-2'>
              <div className='flex h-full flex-1 items-center'>
                <nav className='flex h-full w-full items-center'>
                  <ul className='flex w-full flex-col items-center gap-2 pt-5'>
                    {menusConfig.map(item => (
                      <MenuItem key={item.href} item={item} />
                    ))}
                  </ul>
                </nav>
              </div>
            </ScrollArea>
          </div>
        </div>
      </motion.div>

      <div className='bg-primary-10 fixed top-0 z-50 flex w-full items-center justify-between px-4 py-3'>
        <Link href='/' aria-label='Home'>
          <SiteLogoBig className='text-primary w-32' />
        </Link>

        <div className='flex items-center gap-2'>
          <NotificationsPopover />
          {/* <SupportDialog /> */}
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
      <div className='fixed right-5 bottom-5 z-10'>
        <SupportDialog />
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

export default MobileMenu
