'use client'

import { SiteLogoNoText } from '@/components/svg'
import { Button, ButtonProps } from '@/components/ui/button'
import { useProfile } from '@/context/ProfileProvider'
import { usePermission } from '@/hooks/use-permission'
import { getActiveMenuApp, getMenuConfig } from '@/lib/get-menu-config'
import { isTenantUser } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MenuItem } from '../type'
import { isLocationMatch } from '../utils'
import { BottomMenu, type BottomMenuItem, type BottomMenuSection } from './BottomMenu'
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

type MobileMenuItem = {
  key: string
  title: string
  href: Route
  Icon: MenuItem['Icon']
  menuType: MenuItem['type']
}

const buildMobileMenuItems = (
  menus: MenuItem[] | null,
  checkRoute: (route: Route) => boolean,
  excludedRoutes: Set<Route>
): MobileMenuItem[] => {
  if (!menus) return []

  const items: MobileMenuItem[] = []

  for (const menu of menus) {
    if (!checkRoute(menu.href) || excludedRoutes.has(menu.href)) continue
    items.push({
      key: `${menu.type}-${menu.href}`,
      title: menu.title,
      href: menu.href,
      Icon: menu.Icon,
      menuType: menu.type
    })
  }

  return items
}

const isMenuActive = (item: MobileMenuItem, pathname: string | null) => isLocationMatch(item.href, pathname)

export function BottomNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { profile } = useProfile()
  const tenant = isTenantUser(profile)
  const menus = getMenuConfig(profile, pathname)
  const activeApp = getActiveMenuApp(profile, pathname)

  const handleToggleMenu = () => {
    setIsOpen(prev => !prev)
  }

  const handleCloseMenu = () => {
    setIsOpen(false)
  }

  const { checkRoute, canCreateOrder } = usePermission()

  const showCreateOrder = !tenant && canCreateOrder && !activeApp
  const showNewApplication = !!tenant
  const excludedRoutes = new Set<Route>()
  if (showCreateOrder) excludedRoutes.add('/orders/create')
  if (showNewApplication) excludedRoutes.add('/applications/new')

  const visibleMenus = buildMobileMenuItems(menus, checkRoute, excludedRoutes)
  const primaryMenus = (() => {
    if (activeApp) {
      return visibleMenus.slice(0, 3)
    }

    if (tenant) {
      const activeMenuIndex = visibleMenus.findIndex(item => isMenuActive(item, pathname))
      const tenantPrimary = [...visibleMenus.slice(0, 3)]
      if (activeMenuIndex >= 3 && tenantPrimary.length === 3) {
        tenantPrimary[2] = visibleMenus[activeMenuIndex]!
      }
      return tenantPrimary
    }

    const restaurantPrimaryOrder: Array<Route> = ['/', '/orders', '/b2b-commerce/orders/create']
    const lockedToOverflow = (item: MobileMenuItem) => item.href === '/reports' || item.href === '/reconciliation'

    const picked: MobileMenuItem[] = []
    const pickedKeys = new Set<string>()

    for (const route of restaurantPrimaryOrder) {
      const candidate = visibleMenus.find(item => item.href === route && !lockedToOverflow(item))
      if (!candidate) continue
      picked.push(candidate)
      pickedKeys.add(candidate.key)
    }

    if (picked.length < 3) {
      for (const item of visibleMenus) {
        if (picked.length >= 3) break
        if (pickedKeys.has(item.key)) continue
        if (lockedToOverflow(item)) continue
        picked.push(item)
        pickedKeys.add(item.key)
      }
    }

    return picked
  })()

  const primaryMenuKeySet = new Set(primaryMenus.map(item => item.key))
  const overflowTopLevel = visibleMenus.filter(item => !primaryMenuKeySet.has(item.key))
  const overflowQuickItems: BottomMenuItem[] = overflowTopLevel.map(item => ({
    key: item.key,
    title: item.title,
    href: item.href,
    Icon: item.Icon
  }))
  const overflowSections: BottomMenuSection[] = []
  const isOverflowOpen = isOpen

  if (primaryMenus.length === 0 && !showCreateOrder && !showNewApplication) return null

  return (
    <>
      {isOverflowOpen && (
        <div
          className='bg-default-950/20 fixed inset-0 z-40 backdrop-blur-sm'
          onClick={() => {
            setIsOpen(false)
          }}
        />
      )}

      <nav
        className={cn(
          'border-border bg-muted/40 ring-accent fixed bottom-1 left-1/2 z-50 mb-1 w-[95%] max-w-max -translate-x-1/2 rounded-3xl border-t py-0.5 pr-0.5 pl-1 ring-2 backdrop-blur-2xl',
          activeApp && 'border-border bg-background/90'
        )}
      >
        <AnimatePresence mode='wait'>
          {isOverflowOpen && (
            <BottomMenu onClick={handleCloseMenu} quickItems={overflowQuickItems} sections={overflowSections} />
          )}
        </AnimatePresence>
        {activeApp && (
          <div className='bg-primary absolute -top-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full' aria-hidden />
        )}
        <motion.div layout transition={{ duration: 0.2 }}>
          {activeApp ? (
            <motion.div
              key='mobile-app-menu'
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className='grid min-w-[320px] grid-cols-[1fr_1fr_1fr_auto] items-center gap-1 pr-0.5'
            >
              {primaryMenus.map(item => (
                <BottomNavigationItem
                  key={item.key}
                  href={item.href}
                  label={item.title}
                  icon={item.Icon}
                  isActive={isMenuActive(item, pathname)}
                  className='min-w-0 px-2'
                  onClick={() => {
                    setIsOpen(false)
                  }}
                />
              ))}
              <div className='flex items-center justify-center'>
                <Button
                  color={isOverflowOpen ? 'light' : 'secondary'}
                  size='icon'
                  className='size-14 rounded-full p-1 pt-0 pb-1'
                  onClick={handleToggleMenu}
                  aria-label='Menüyu Aç ve Kapat'
                >
                  <SiteLogoNoText className='text-primary size-full' />
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className='xs:gap-x-3 relative flex items-center justify-between gap-x-2'>
              {/* Sol taraf - İlk 2 item */}
              {primaryMenus.slice(0, 2).length > 0 && (
                <div className='xs:gap-x-3 flex flex-1 items-center justify-around gap-x-2'>
                  {primaryMenus.slice(0, 2).map(item => (
                    <BottomNavigationItem
                      key={item.key}
                      href={item.href}
                      label={item.title}
                      icon={item.Icon}
                      isActive={isMenuActive(item, pathname)}
                      onClick={() => {
                        setIsOpen(false)
                      }}
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
                {primaryMenus.slice(2, 3).map(item => (
                  <BottomNavigationItem
                    key={item.key}
                    href={item.href}
                    label={item.title}
                    icon={item.Icon}
                    isActive={isMenuActive(item, pathname)}
                    className={cn(item.menuType === 'app' && 'border-primary/20 bg-primary/5 text-primary shadow-sm')}
                    onClick={() => {
                      setIsOpen(false)
                    }}
                  />
                ))}
                {!activeApp && (
                  <div className='flex items-center justify-center'>
                    <Button
                      color={isOverflowOpen ? 'light' : 'secondary'}
                      size='icon'
                      className='size-14 rounded-full p-1 pt-0 pb-1'
                      onClick={handleToggleMenu}
                      aria-label='Menüyu Aç ve Kapat'
                    >
                      <SiteLogoNoText className='text-primary size-full' />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </nav>
    </>
  )
}
