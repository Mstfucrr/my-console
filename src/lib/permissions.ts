import { IProfileResponse } from '@/types/profile'
import { Route } from 'next'

const allRoutes: Route[] = [
  '/',
  '/orders',
  '/orders/create',
  '/reconciliation',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/reports'
]

const allowedRoutesForEveryProfile: Route[] = ['/login', '/forgot-password', '/reset-password']

type RouteRestriction = {
  include?: Route[]
  exclude?: Route[]
}

// Profile prop bazlı route kısıtlamaları
// include: route'a erişim izni verilir (whitelist)
// exclude: route'a erişim izni verilmez (blacklist)
export const profileRouteRestrictions: Partial<Record<keyof IProfileResponse, RouteRestriction>> = {
  tab_fr: { include: ['/reconciliation'] }
  // isActiveForPackageService: { exclude: ['/orders'] }
}

// Profile prop kontrolü
export const checkProfileRouteAccess = (profile: IProfileResponse | undefined, route: Route): boolean => {
  // Her profile için izinli route'lar
  if (allowedRoutesForEveryProfile.includes(route)) return true

  if (!profile) return true

  for (const [propKey, restriction] of Object.entries(profileRouteRestrictions)) {
    const propValue = profile[propKey as keyof IProfileResponse]
    if (propValue !== true || !restriction) continue

    if (restriction.include && !restriction.include.includes(route)) return false
    if (restriction.exclude && restriction.exclude.includes(route)) return false
  }

  return true
}

export const getFirstAllowedRoute = (profile: IProfileResponse | undefined): Route => {
  if (!profile) return '/'

  for (const [propKey, restriction] of Object.entries(profileRouteRestrictions)) {
    const propValue = profile[propKey as keyof IProfileResponse]
    if (propValue !== true || !restriction) continue

    if (restriction.include && restriction.include.length > 0) return restriction.include[0]!

    if (restriction.exclude && restriction.exclude.length > 0) {
      const allowedRoute = allRoutes.find(route => !restriction.exclude?.includes(route))
      if (allowedRoute) return allowedRoute
      // If all routes are excluded, fallback to home
      return '/'
    }
  }

  return '/'
}
