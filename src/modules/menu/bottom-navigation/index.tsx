'use client'

import { SiteLogoNoText } from '@/components/svg'
import { Button, ButtonProps } from '@/components/ui/button'
import { useProfile } from '@/context/ProfileProvider'
import { usePermission } from '@/hooks/use-permission'
import { getMenuConfig } from '@/lib/get-menu-config'
import { isTenantUser } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { isLocationMatch } from '../utils'
import { BottomMenu } from './BottomMenu'
import { BottomNavigationItem } from './BottomNavigationItem'

type CenterActionButtonProps = {
  showCreateOrder: boolean
  onClose: () => void
}

function CenterActionButtonContent(props: ButtonProps) {
  return (
    <Button
      color='success'
      size='icon'
      className={cn(
        'relative z-11',
        'flex size-14 items-center justify-center rounded-full',
        'transition-all hover:scale-105 hover:shadow-xl active:scale-95',
        'ring-background -mt-6 ring-4'
      )}
      {...props}
    >
      <Plus className='size-7' strokeWidth={2.5} />
    </Button>
  )
}
function CenterActionButton({ showCreateOrder, onClose }: CenterActionButtonProps) {
  const pathname = usePathname()

  const href = showCreateOrder ? '/orders/create' : '/applications/new'
  const ariaLabel = showCreateOrder ? 'Yeni Sipariş Oluştur' : 'Şube Başvurusu'
  const isActive = isLocationMatch(href, pathname)
  const isDisabled = isLocationMatch('/applications/new', pathname) || isLocationMatch('/orders/create', pathname)

  if (isDisabled) {
    return (
      <div className='relative flex flex-col items-center justify-center'>
        <CenterActionButtonContent disabled={isDisabled} />
      </div>
    )
  }

  return (
    <div className='relative flex flex-col items-center justify-center'>
      <Link href={href} aria-label={ariaLabel} onClick={onClose}>
        <CenterActionButtonContent disabled={isDisabled} />
      </Link>
      {isActive && <div className='bg-primary absolute -bottom-3 h-0.5 w-full' />}
    </div>
  )
}

export function BottomNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { profile } = useProfile()
  const tenant = isTenantUser(profile)
  const menus = getMenuConfig(profile)

  const handleToggleMenu = () => setIsOpen(prev => !prev)

  const { checkRoute, canCreateOrder } = usePermission()

  const visibleMenus = menus?.filter(item => checkRoute(item.href)) ?? []
  const showCreateOrder = !tenant && canCreateOrder
  const showNewApplication = !!tenant

  if (visibleMenus.length < 2 && !showCreateOrder && !showNewApplication) return null

  return (
    <>
      {isOpen && <div className='bg-default-950/20 fixed inset-0 z-40 backdrop-blur-sm' onClick={handleToggleMenu} />}

      <nav className='border-border bg-muted/40 ring-accent fixed bottom-1 left-1/2 z-50 mb-1 w-[95%] max-w-max -translate-x-1/2 rounded-3xl border-t py-0.5 pr-0.5 pl-1 ring-2 backdrop-blur-2xl'>
        <div>
          <div className='xs:gap-x-3 relative flex items-center justify-between gap-x-2'>
            {/* Sol taraf - İlk 2 item */}
            {visibleMenus.slice(0, 2).length > 0 && (
              <div className='xs:gap-x-3 flex flex-1 items-center justify-around gap-x-2'>
                {visibleMenus.slice(0, 2).map(item => (
                  <BottomNavigationItem
                    key={item.href}
                    href={item.href}
                    label={item.title}
                    icon={item.Icon}
                    isActive={isLocationMatch(item.href, pathname)}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            )}

            {/* Ortadaki Add Button: restoran → Yeni Sipariş, tenant → Yeni Başvuru */}
            {(showCreateOrder || showNewApplication) && (
              <CenterActionButton showCreateOrder={!!showCreateOrder} onClose={() => setIsOpen(false)} />
            )}

            {/* Sağ taraf - Son 2 item */}
            <div className='xs:gap-x-3 relative z-10 flex flex-1 items-center justify-around pr-1'>
              {visibleMenus.slice(2, 3).map(item => (
                <BottomNavigationItem
                  key={item.href}
                  href={item.href}
                  label={item.title}
                  icon={item.Icon}
                  isActive={isLocationMatch(item.href, pathname)}
                  onClick={() => setIsOpen(false)}
                />
              ))}
              <AnimatePresence mode='wait'>{isOpen && <BottomMenu onClick={handleToggleMenu} />}</AnimatePresence>
              <div className='flex items-center justify-center'>
                <Button
                  color={isOpen ? 'light' : 'secondary'}
                  size='icon'
                  className='size-14 rounded-full p-1 pt-0 pb-1'
                  onClick={handleToggleMenu}
                  aria-label='Menüyu Aç ve Kapat'
                >
                  <SiteLogoNoText className='text-primary size-full' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
