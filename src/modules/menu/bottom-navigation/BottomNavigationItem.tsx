'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'

interface BottomNavigationItemProps {
  href: Route
  label: string
  icon: LucideIcon
  isActive: boolean
}

export function BottomNavigationItem({ href, label, icon: Icon, isActive }: BottomNavigationItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'relative flex flex-col items-center justify-center gap-1 rounded-3xl px-2 py-2.5 text-center transition-colors',
        'min-w-[60px] flex-1',
        isActive
          ? 'text-primary bg-background border-primary -mb-1.5 scale-105 border-b-2'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className={cn('size-5 transition-all', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
      <span
        className={cn('text-[10px] leading-tight font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}
      >
        {label}
      </span>
    </Link>
  )
}
