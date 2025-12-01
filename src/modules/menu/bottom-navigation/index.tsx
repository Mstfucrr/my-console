'use client'

import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { menusConfig } from '../menus'
import { isLocationMatch } from '../utils'
import { BottomNavigationItem } from './BottomNavigationItem'

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className='border-border bg-background/95 supports-backdrop-filter:bg-background/60 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur'>
      {/* iOS home indicator için padding */}
      <div className='safe-area-inset-bottom'>
        <div className='relative flex items-center justify-between px-1 py-2'>
          {/* Sol taraf - İlk 2 item */}
          <div className='flex flex-1 items-center justify-around'>
            {menusConfig.slice(0, 2).map(item => (
              <BottomNavigationItem
                key={item.title}
                href={item.href}
                label={item.title}
                icon={item.Icon}
                isActive={isLocationMatch(item.href, pathname)}
              />
            ))}
          </div>

          {/* Ortadaki Add Button */}
          <div className='relative flex flex-col items-center justify-center'>
            <Link
              href='/orders/create'
              className={cn(
                'relative z-10',
                'flex size-14 items-center justify-center rounded-full',
                'bg-primary text-primary-foreground shadow-lg',
                'transition-all hover:scale-105 hover:shadow-xl active:scale-95',
                'ring-background -mt-6 ring-4'
              )}
              aria-label='Yeni Sipariş Oluştur'
            >
              <Plus className='size-7' strokeWidth={2.5} />
              <span className='sr-only'>Yeni Sipariş</span>
            </Link>
            <span className={cn('mt-1 -mb-2 text-xs', isLocationMatch('/orders/create', pathname) && 'font-semibold')}>
              Yeni Sipariş
            </span>
            {isLocationMatch('/orders/create', pathname) && (
              <div className='bg-primary absolute -bottom-3 h-0.5 w-full' />
            )}
          </div>

          {/* Sağ taraf - Son 2 item */}
          <div className='flex flex-1 items-center justify-around'>
            {menusConfig.slice(2, 4).map(item => (
              <BottomNavigationItem
                key={item.title}
                href={item.href}
                label={item.title}
                icon={item.Icon}
                isActive={isLocationMatch(item.href, pathname)}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
