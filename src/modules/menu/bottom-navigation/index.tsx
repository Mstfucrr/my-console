'use client'

import { SiteLogoNoText } from '@/components/svg'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/context/ProfileProvider'
import { usePermission } from '@/hooks/use-permission'
import { getMenuConfig } from '@/lib/get-menu-config'
import { isTenantUser } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
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

function CenterActionButton({ showCreateOrder, onClose }: CenterActionButtonProps) {
  const pathname = usePathname()

  const href = showCreateOrder ? '/orders/create' : '/applications/new'
  const ariaLabel = showCreateOrder ? 'Yeni Sipariş Oluştur' : 'Şube Başvurusu'
  const isActive = isLocationMatch(href, pathname)

  return (
    <div className='relative flex flex-col items-center justify-center'>
      <Link
        href={href}
        className={cn(
          'relative z-11',
          'flex size-14 items-center justify-center rounded-full',
          'bg-success text-primary-foreground shadow-lg',
          'transition-all hover:scale-105 hover:shadow-xl active:scale-95',
          'ring-background -mt-6 ring-4'
        )}
        aria-label={ariaLabel}
        onClick={onClose}
      >
        <Plus className='size-7' strokeWidth={2.5} />
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
}
type MobileMenuWithChildren = MobileMenuItem & { children?: Array<{ key: string; title: string; href: Route }> }

const buildMobileMenuItems = (
  menus: MenuItem[] | null,
  checkRoute: (route: Route) => boolean,
  excludedRoutes: Set<Route>
): MobileMenuWithChildren[] => {
  if (!menus) return []

  const items: MobileMenuWithChildren[] = []

  for (const menu of menus) {
    if ('href' in menu) {
      if (!checkRoute(menu.href) || excludedRoutes.has(menu.href)) continue
      items.push({
        key: `single-${menu.href}`,
        title: menu.title,
        href: menu.href,
        Icon: menu.Icon
      })
      continue
    }

    const visibleChildren = menu.children
      .filter(child => checkRoute(child.href) && !excludedRoutes.has(child.href))
      .map(child => ({
        key: `multi-child-${menu.title}-${child.href}`,
        title: child.title,
        href: child.href
      }))

    if (visibleChildren.length === 0) continue

    items.push({
      key: `multi-${menu.title}`,
      title: menu.title,
      href: visibleChildren[0]!.href,
      Icon: menu.Icon,
      children: visibleChildren
    })
  }

  return items
}

const isMenuActive = (item: MobileMenuWithChildren, pathname: string | null) =>
  isLocationMatch(item.href, pathname) || item.children?.some(child => isLocationMatch(child.href, pathname)) === true

export function BottomNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedPrimaryKey, setExpandedPrimaryKey] = useState<string | null>(null)
  const { profile } = useProfile()
  const tenant = isTenantUser(profile)
  const menus = getMenuConfig(profile)

  const handleToggleMenu = () => {
    setExpandedPrimaryKey(null)
    setIsOpen(prev => !prev)
  }

  const { checkRoute, canCreateOrder } = usePermission()

  const showCreateOrder = !tenant && canCreateOrder
  const showNewApplication = !!tenant
  const excludedRoutes = new Set<Route>()
  if (showCreateOrder) excludedRoutes.add('/orders/create')
  if (showNewApplication) excludedRoutes.add('/applications/new')

  const visibleMenus = buildMobileMenuItems(menus, checkRoute, excludedRoutes)
  const primaryMenus = (() => {
    if (tenant) {
      const activeMenuIndex = visibleMenus.findIndex(item => isMenuActive(item, pathname))
      const tenantPrimary = [...visibleMenus.slice(0, 3)]
      if (activeMenuIndex >= 3 && tenantPrimary.length === 3) {
        tenantPrimary[2] = visibleMenus[activeMenuIndex]!
      }
      return tenantPrimary
    }

    const restaurantPrimaryOrder: Array<Route> = ['/', '/orders', '/reconciliation']
    const lockedToOverflow = (item: MobileMenuWithChildren) => item.href === '/reports' || Boolean(item.children?.length)

    const picked: MobileMenuWithChildren[] = []
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
  const overflowQuickItems: BottomMenuItem[] = overflowTopLevel
    .filter(item => !item.children || item.children.length === 0)
    .map(item => ({
      key: item.key,
      title: item.title,
      href: item.href,
      Icon: item.Icon
    }))
  const overflowSections: BottomMenuSection[] = overflowTopLevel
    .filter(item => item.children && item.children.length > 0)
    .map(item => ({
      key: `section-${item.key}`,
      title: item.title,
      Icon: item.Icon,
      items: item.children!.map(child => ({
        key: child.key,
        title: child.title,
        href: child.href
      }))
    }))

  if (primaryMenus.length === 0 && !showCreateOrder && !showNewApplication) return null

  const expandedPrimary = primaryMenus.find(item => item.key === expandedPrimaryKey && item.children?.length)

  return (
    <>
      {(isOpen || expandedPrimary) && (
        <div
          className='bg-default-950/20 fixed inset-0 z-40 backdrop-blur-sm'
          onClick={() => {
            setIsOpen(false)
            setExpandedPrimaryKey(null)
          }}
        />
      )}

      <nav className='border-border bg-muted/40 ring-accent fixed bottom-1 left-1/2 z-50 mb-1 w-[95%] max-w-max -translate-x-1/2 rounded-3xl border-t py-0.5 pr-0.5 pl-1 ring-2 backdrop-blur-2xl'>
        {expandedPrimary?.children && (
          <div className='bg-background border-border absolute bottom-[calc(100%+8px)] left-1/2 w-[95%] -translate-x-1/2 rounded-xl border p-2 shadow-lg'>
            <div className='flex flex-col gap-1'>
              {expandedPrimary.children.map(child => (
                <Link
                  key={child.key}
                  href={child.href}
                  onClick={() => {
                    setExpandedPrimaryKey(null)
                    setIsOpen(false)
                  }}
                >
                  <Button
                    variant='ghost'
                    size='xs'
                    className={cn(
                      'hover:bg-primary hover:text-primary-foreground w-full justify-start rounded-lg text-xs',
                      isLocationMatch(child.href, pathname) && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {child.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className='xs:gap-x-3 relative flex items-center justify-between gap-x-2'>
            {/* Sol taraf - İlk 2 item */}
            {primaryMenus.slice(0, 2).length > 0 && (
              <div className='xs:gap-x-3 flex flex-1 items-center justify-around gap-x-2'>
                {primaryMenus.slice(0, 2).map(item => (
                  item.children?.length ? (
                    <BottomNavigationItem
                      key={item.key}
                      label={item.title}
                      icon={item.Icon}
                      isActive={isMenuActive(item, pathname)}
                      hasChildren
                      isExpanded={expandedPrimaryKey === item.key}
                      onToggleChildren={() => {
                        setExpandedPrimaryKey(prev => (prev === item.key ? null : item.key))
                        setIsOpen(false)
                      }}
                    />
                  ) : (
                    <BottomNavigationItem
                      key={item.key}
                      href={item.href}
                      label={item.title}
                      icon={item.Icon}
                      isActive={isMenuActive(item, pathname)}
                      onClick={() => {
                        setExpandedPrimaryKey(null)
                        setIsOpen(false)
                      }}
                    />
                  )
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
                item.children?.length ? (
                  <BottomNavigationItem
                    key={item.key}
                    label={item.title}
                    icon={item.Icon}
                    isActive={isMenuActive(item, pathname)}
                    hasChildren
                    isExpanded={expandedPrimaryKey === item.key}
                    onToggleChildren={() => {
                      setExpandedPrimaryKey(prev => (prev === item.key ? null : item.key))
                      setIsOpen(false)
                    }}
                  />
                ) : (
                  <BottomNavigationItem
                    key={item.key}
                    href={item.href}
                    label={item.title}
                    icon={item.Icon}
                    isActive={isMenuActive(item, pathname)}
                    onClick={() => {
                      setExpandedPrimaryKey(null)
                      setIsOpen(false)
                    }}
                  />
                )
              ))}
              <AnimatePresence mode='wait'>
                {isOpen && (
                  <BottomMenu onClick={handleToggleMenu} quickItems={overflowQuickItems} sections={overflowSections} />
                )}
              </AnimatePresence>
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
