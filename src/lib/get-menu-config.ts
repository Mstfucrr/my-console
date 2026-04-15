import { menusConfig, tenantMenusConfig } from '@/modules/menu/menus'
import { IProfileResponse } from '@/types/profile'
import { isTenantUser } from './permissions'

export const getMenuConfig = (profile?: IProfileResponse) => {
  if (!profile) return null
  if (isTenantUser(profile)) return tenantMenusConfig
  return menusConfig
}
