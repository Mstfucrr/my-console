'use client'
import { cn } from '@/lib/utils'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItem } from '../type'
import { isLocationMatch } from '../utils'

type LockLinkProps = {
  href: string
  children: React.ReactNode
  subItem: MenuItem
  target?: string
}

function LockLink({ href, target, children, subItem }: LockLinkProps) {
  if (subItem.badge) {
    return (
      <span className='flex cursor-not-allowed items-center space-x-3 text-sm opacity-50 transition-all duration-150'>
        <span className={`border-default-600 inline-block h-2 w-2 flex-none rounded-full border`}></span>
        <div className='text-default-600 flex flex-1 truncate'>
          <div className='flex-1 truncate'>{subItem.title}</div>
          <Badge className='flex-none px-1 text-xs leading-0 font-normal capitalize'>{subItem.badge}</Badge>
        </div>
      </span>
    )
  } else {
    return (
      <Link href={href} target={target}>
        {children}
      </Link>
    )
  }
}

type SubMenuItemProps = {
  subItem: MenuItem
}

const SubMenuItem = ({ subItem }: SubMenuItemProps) => {
  const { Icon, title } = subItem
  const pathname = usePathname()
  const isActive = isLocationMatch(subItem.href, pathname)

  return (
    <LockLink href={subItem.href ?? ''} target={subItem.target} subItem={subItem}>
      <div
        className={cn(
          'flex items-center gap-3 rounded text-base font-normal capitalize transition-all duration-150',
          isActive ? 'text-primary' : 'text-default-600'
        )}
      >
        {Icon && <Icon className='size-4' />}
        <span className='flex-1 truncate'>{title}</span>
        {subItem.target === '_blank' && <ExternalLink className='size-4' />}
      </div>
    </LockLink>
  )
}

export default SubMenuItem
