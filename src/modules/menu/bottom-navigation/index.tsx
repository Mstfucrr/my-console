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
    <nav className='border-border bg-muted/40 ring-accent fixed bottom-1 left-1/2 z-50 w-[95%] max-w-[450] -translate-x-1/2 rounded-3xl border-t ring-2 backdrop-blur-2xl'>
      {/* iOS home indicator için padding */}
      <div className='safe-area-inset-bottom'>
        <div className='xs:gap-x-5 relative flex items-center justify-between gap-x-2'>
          {/* Sol taraf - İlk 2 item */}
          <div className='xs:gap-x-3 flex flex-1 items-center justify-around gap-x-2'>
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
                'bg-success text-primary-foreground shadow-lg',
                'transition-all hover:scale-105 hover:shadow-xl active:scale-95',
                'ring-background -mt-6 ring-4'
              )}
              aria-label='Yeni Sipariş Oluştur'
            >
              <Plus className='size-7' strokeWidth={2.5} />
            </Link>
            {isLocationMatch('/orders/create', pathname) && (
              <div className='bg-primary absolute -bottom-3 h-0.5 w-full' />
            )}
          </div>

          {/* Sağ taraf - Son 2 item */}
          <div className='xs:gap-x-3 flex flex-1 items-center justify-around gap-x-2'>
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
