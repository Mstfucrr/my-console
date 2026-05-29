import { useProfile } from '@/context/ProfileProvider'
import { checkProfileRouteAccess, getFirstAllowedRoute } from '@/lib/permissions'
import { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'

export const usePermission = () => {
  const { profile } = useProfile()
  const pathname = usePathname()
  const router = useRouter()

  const checkRoute = useCallback((route: Route): boolean => checkProfileRouteAccess(profile, route), [profile])

  const firstAllowedRoute = useMemo(() => getFirstAllowedRoute(profile), [profile])

  const canCreateOrder = useMemo(
    () => checkRoute('/orders/create') && profile?.info?.isPartnerEnabled,
    [checkRoute, profile]
  )

  useEffect(() => {
    if (pathname === '/orders/create' && canCreateOrder === false) router.push('/')
  }, [pathname, canCreateOrder, router])

  return { checkRoute, firstAllowedRoute, canCreateOrder }
}
