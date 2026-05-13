'use client'

import { SiteLogoBig } from '@/components/svg'
import { useProfile } from '@/context/ProfileProvider'
import { getActiveMenuApp, getMenuConfig } from '@/lib/get-menu-config'
import { isTenantUser } from '@/lib/permissions'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { CreateOrderButton } from '../common/create-order-button'
import { MenuItem } from '../common/menu-item'
import { NewApplicationButton } from '../common/new-application-button'
import { ProfileButton } from '../common/profile-button'
import { SupportDialog } from '../common/support-dialog'

export function Topbar() {
  const { profile } = useProfile()
  const pathname = usePathname()
  const menus = getMenuConfig(profile, pathname)
  const activeApp = getActiveMenuApp(profile, pathname)
  const tenant = isTenantUser(profile)

  // const appMenuLayoutId = `menu-item-${activeApp?.title.toLowerCase()}-${activeApp?.href.toLowerCase()}`

  const alwaysShowMenus = activeApp ? menus?.filter(item => item.type === 'link' && item.alwaysShow === true) : null

  const appMenus = activeApp ? activeApp.appMenuItems : menus

  return (
    <>
      <div className='bg-primary-10 fixed top-0 z-50 w-full border-b shadow-md backdrop-blur-xl'>
        <div className='container mx-auto flex h-16 items-center gap-4 px-4'>
          <SiteLogoBig className='text-primary w-32' />

          <div className='flex h-full flex-1 items-center gap-3'>
            <nav className='flex h-10 w-auto items-center border-0 pr-1'>
              <motion.ul layout='position' className='flex items-center gap-1'>
                <AnimatePresence mode='sync' initial={false}>
                  {alwaysShowMenus?.map(item => <MenuItem key={item.href} item={item} />)}
                  {/* {activeApp && (
                    <motion.div
                      layoutId={appMenuLayoutId}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className='text-primary mx-2 hidden h-full items-center gap-2 text-xs font-semibold lg:flex'
                    >
                      <activeApp.Icon className='size-4' />
                      <span>{activeApp.appTitle}</span> <ChevronRight className='size-4' />
                    </motion.div>
                  )} */}
                  {appMenus?.map(item => <MenuItem key={item.href} item={item} />)}
                </AnimatePresence>
              </motion.ul>
            </nav>
          </div>

          <AnimatePresence mode='sync' initial={false}>
            <motion.div
              layoutId='topbar-action-buttons'
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className='ml-auto flex items-center gap-2'
            >
              {(!activeApp ||
                activeApp.appMenuItems?.some(
                  item => item.href === '/applications/new' || item.href === '/orders/create'
                )) && <>{!tenant ? <CreateOrderButton /> : <NewApplicationButton />}</>}
              <ProfileButton />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className='fixed right-5 bottom-5 z-50'>
        <SupportDialog />
      </div>
    </>
  )
}
