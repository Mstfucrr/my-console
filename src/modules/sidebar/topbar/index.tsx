'use client'

import { SiteLogoBig } from '@/components/svg'
import { Button } from '@/components/ui/button'
import { useIsDesktop } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { menusConfig } from '@/modules/sidebar/menus'
import { MenuItem } from '@/modules/sidebar/type'
import { isLocationMatch } from '@/modules/sidebar/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserMenu from './user-menu'

const Topbar = () => {
  const pathname = usePathname()
  const isDesktop = useIsDesktop()
  const menus = menusConfig?.sidebarNav || []

  return (
    <div className='bg-primary-10 fixed top-0 z-50 w-full border-b shadow-md backdrop-blur-xl'>
      <div className='mx-auto flex h-16 items-center gap-4 px-4'>
        <Link href='/' aria-label='Home' className='flex items-center'>
          <SiteLogoBig className='text-primary w-32' />
        </Link>

        <div className='flex h-full flex-1 items-center'>
          <nav className='flex h-full items-center'>
            <ul className='flex items-center gap-1'>
              {menus.map((item: MenuItem, idx: number) => {
                const isActive = isLocationMatch(item.href, pathname)
                return (
                  <li key={`top_menu_${idx}`}>
                    <Link href={item.href ?? '#'} target={item.target}>
                      <Button
                        variant='ghost'
                        className={cn(
                          'hover:bg-primary hover:text-primary-foreground flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium',
                          { 'text-primary': isActive }
                        )}
                      >
                        {item.Icon && <item.Icon className='size-5' />}
                        <span className='whitespace-nowrap'>{item.title}</span>
                      </Button>
                    </Link>
                  </li>
                )
              })}
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
