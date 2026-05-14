import { IProfileResponse } from '@/types/profile'
import { Route } from 'next'

/** profile accountType tenant ise tenant (şube) kullanıcısıdır */
export const isTenantUser = (profile?: IProfileResponse): boolean => profile?.accountType === 'tenant'

/** NEXT_PUBLIC_ACTIVE_TENANT environment variable'ı true ise tenant kullanıcıları mevcut URL'de kalır; private layout bakım UI'si gösterilir */
export const isActiveTenant = process.env.NEXT_PUBLIC_ACTIVE_TENANT === 'true'

export const canSubmitStoreApplication = process.env.NEXT_PUBLIC_ACTIVE_STORE_APPLICATION === 'true'

/** Tenant modülü kapalı mı? (layout'ta URL değiştirmeden bakım göstermek için) */
export const isTenantModuleAvailable = (profile?: IProfileResponse): boolean => isTenantUser(profile) && isActiveTenant

const allRoutes: Array<Route> = [
  '/',
  '/orders',
  '/orders/create',
  '/reconciliation',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/reports',
  '/onboarding',
  '/applications',
  '/applications/new',
  '/stores',
  '/business-setup',
  '/account'
]

const tenantRoutes: Array<Route> = [
  '/business-setup',
  '/applications',
  '/applications/new',
  '/stores',
  '/onboarding',
  '/account'
]

/** Tenant’ta işletme bilgileri zorunlu: companyType yoksa kurulum tamamlanmamış sayılır */
export const tenantNeedsBusinessSetup = (profile?: IProfileResponse): boolean =>
  !profile?.data?.financialDetails?.companyType

const allowedRoutesForEveryProfile: Array<Route> = ['/login', '/forgot-password', '/reset-password', '/onboarding']

type RouteRestriction = {
  include?: Array<Route>
  exclude?: Array<Route>
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
  if (allowedRoutesForEveryProfile.includes(route)) return true

  if (!profile) return true

  // Tenant kullanıcılar için erişim: Her koşul ayrı kontrol edilerek daha anlaşılır şekilde işleniyor
  if (isTenantUser(profile)) {
    // Tenant modülü kapalıysa izin verme
    if (!isActiveTenant) return false

    // route tenant'a ait değilse izin verme
    if (!tenantRoutes.includes(route)) return false

    const needsBusinessSetup = tenantNeedsBusinessSetup(profile)

    // İşletme bilgileri gerekiyorsa sadece /business-setup'a erişilebilir
    if (needsBusinessSetup && route !== '/business-setup') return false

    // İşletme bilgileri tamamlandıysa /business-setup erişimi kapalı olmalı
    if (!needsBusinessSetup && route === '/business-setup') return false
  } else {
    if (tenantRoutes.includes(route)) return false
  }

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

  if (isTenantUser(profile)) {
    return tenantNeedsBusinessSetup(profile) ? '/business-setup' : '/applications'
  }

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
