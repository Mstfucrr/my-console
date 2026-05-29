import { useIsMobile } from '@/hooks/use-media-query'
import { usePermission } from '@/hooks/use-permission'
import { usePathname } from 'next/navigation'
import { isLocationMatch } from '../utils'
import { MenuPrimaryActionLink } from './menu-primary-action-link'

export function CreateOrderButton() {
  const isMobile = useIsMobile()
  const { canCreateOrder } = usePermission()
  const pathname = usePathname()

  if (!canCreateOrder) return null

  return (
    <MenuPrimaryActionLink
      href='/orders/create'
      label='Yeni Sipariş'
      isOnRoute={isLocationMatch('/orders/create', pathname)}
      size={!isMobile ? 'xs' : 'icon-sm'}
    />
  )
}
