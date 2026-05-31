import { menusConfig, tenantMenusConfig } from '@/modules/shell/menu/menus'
import type { AppMenuItem, MenuItem } from '@/modules/shell/menu/type'
import { IProfileResponse } from '@/types/profile'
import { isTenantUser } from './permissions'

const isPathInApp = (pathname: string | null | undefined, item: MenuItem): item is AppMenuItem => {
  if (item.type !== 'app' || !pathname) return false
  return pathname === item.activePathPrefix || pathname.startsWith(`${item.activePathPrefix}/`)
}

export const getActiveMenuApp = (profile?: IProfileResponse, pathname?: string | null): AppMenuItem | null => {
  if (!profile || isTenantUser(profile)) return null
  return menusConfig.find(item => isPathInApp(pathname, item)) ?? null
}

export const getMenuConfig = (profile?: IProfileResponse, pathname?: string | null) => {
  if (!profile) return null
  if (isTenantUser(profile)) return tenantMenusConfig

  const activeApp = getActiveMenuApp(profile, pathname)
  if (activeApp)
    return [...menusConfig.filter(item => item.type === 'link' && item.alwaysShow === true), ...activeApp.appMenuItems]

  return menusConfig
}
