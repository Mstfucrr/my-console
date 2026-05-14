'use client'

import { useIsMobile } from '@/hooks/use-media-query'
import { usePathname } from 'next/navigation'
import { isLocationMatch } from '../utils'
import { MenuPrimaryActionLink } from './menu-primary-action-link'

export function NewApplicationButton() {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  return (
    <MenuPrimaryActionLink
      href='/applications/new'
      label='Şube Başvurusu'
      isOnRoute={isLocationMatch('/applications/new', pathname)}
      size={!isMobile ? 'xs' : 'icon-sm'}
    />
  )
}
