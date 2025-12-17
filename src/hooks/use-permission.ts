import { useProfile } from '@/context/ProfileProvider'
import { checkProfileRouteAccess, getFirstAllowedRoute } from '@/lib/permissions'
import { Route } from 'next'
import { useCallback, useMemo } from 'react'

export const usePermission = () => {
  const { profile } = useProfile()

  const checkRoute = useCallback((route: Route): boolean => checkProfileRouteAccess(profile, route), [profile])

  const firstAllowedRoute = useMemo(() => getFirstAllowedRoute(profile), [profile])

  return { checkRoute, firstAllowedRoute }
}
