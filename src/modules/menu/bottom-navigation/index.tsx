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
    <nav className='border-border bg-muted/40 fixed bottom-1 left-1/2 z-50 w-[95%] -translate-x-1/2 rounded-3xl border-t backdrop-blur-2xl'>
      {/* iOS home indicator için padding */}
      <div className='safe-area-inset-bottom'>
        <div className='relative flex items-center justify-between gap-x-2'>
          {/* Sol taraf - İlk 2 item */}
          <div className='flex flex-1 items-center justify-around gap-x-2'>
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
            </Link>
            <span
              className={cn(
                'mt-1 -mb-2 text-center text-[10px] text-nowrap',
                isLocationMatch('/orders/create', pathname) && 'font-semibold'
              )}
            >
              Yeni Sipariş
            </span>
            {isLocationMatch('/orders/create', pathname) && (
              <div className='bg-primary absolute -bottom-3 h-0.5 w-full' />
            )}
          </div>

          {/* Sağ taraf - Son 2 item */}
          <div className='flex flex-1 items-center justify-around gap-x-2'>
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
