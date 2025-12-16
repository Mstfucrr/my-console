import { useProfile } from '@/context/ProfileProvider'
import { checkProfileRouteAccess, getFirstAllowedRoute } from '@/lib/permissions'
import { Route } from 'next'

export const usePermission = () => {
  const { profile } = useProfile()

  const checkRoute = (route: Route): boolean => {
    return checkProfileRouteAccess(profile?.info, route)
  }

  const firstAllowedRoute = getFirstAllowedRoute(profile?.info)

  return { checkRoute, firstAllowedRoute }
}
