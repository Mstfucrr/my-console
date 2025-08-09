'use client'

import { SiteLogoBig } from '@/components/svg'
import { menusConfig } from '@/modules/sidebar/menus'
import Link from 'next/link'
import { MenuItem } from '../common/menu-item'
import UserMenu from './user-menu'

const Topbar = () => {
  return (
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

        <div className='ml-auto flex items-center'>
          <UserMenu />
        </div>
      </div>
    </div>
  )
}

export default Topbar
