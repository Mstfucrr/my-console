'use client'

import { SiteLogoBig } from '@/components/svg'
import { menusConfig } from '@/modules/menu/menus'
import Link from 'next/link'
import { CreateOrderButton } from '../common/create-order-button'
import { LogoutButton } from '../common/logout-button'
import { MenuItem } from '../common/menu-item'
import { SupportDialog } from '../common/support-dialog'

export function Topbar() {
  return (
    <>
      <div className='bg-primary-10 fixed top-0 z-50 w-full border-b shadow-md backdrop-blur-xl'>
        <div className='container mx-auto flex h-16 items-center gap-4 px-4'>
          <Link href='/' aria-label='Home' className='flex items-center'>
            <SiteLogoBig className='text-primary w-32' />
          </Link>

          <div className='flex h-full flex-1 items-center'>
            <nav className='flex h-full items-center'>
              <ul className='flex items-center gap-1'>
                {menusConfig.map(item => (
                  <MenuItem key={item.href} item={item} />
                ))}
              </ul>
            </nav>
          </div>

          <div className='ml-auto flex items-center gap-2'>
            <CreateOrderButton />
            {/* <NotificationsPopover /> */}
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className='fixed right-5 bottom-5 z-50'>
        <SupportDialog />
      </div>
    </>
  )
}
