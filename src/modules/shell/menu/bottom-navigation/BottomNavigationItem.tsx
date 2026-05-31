'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ChevronDown, LucideIcon } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'
import { MouseEventHandler } from 'react'

interface BottomNavigationItemBaseProps {
  label: string
  icon: LucideIcon
  isActive: boolean
  className?: string
  onClick?: MouseEventHandler
}

interface BottomNavigationLinkItemProps extends BottomNavigationItemBaseProps {
  href: Route
  hasChildren?: false
}

interface BottomNavigationMultiItemProps extends BottomNavigationItemBaseProps {
  hasChildren: true
  isExpanded: boolean
  onToggleChildren: () => void
}

export type BottomNavigationItemProps = BottomNavigationLinkItemProps | BottomNavigationMultiItemProps

function baseClass(isActive: boolean, className?: string) {
  return cn(
    'relative flex flex-col items-center justify-center gap-1 rounded-3xl px-2 py-2.5 text-center transition-colors',
    'min-w-[60px] flex-1',
    className,
    isActive
      ? 'text-primary bg-background border-primary -mb-1.5 scale-105 border-b-2'
      : 'text-muted-foreground hover:text-foreground'
  )
}

export function BottomNavigationItem(props: BottomNavigationItemProps) {
  if (props.hasChildren) {
    const { label, icon: Icon, isActive, isExpanded, onToggleChildren } = props
    return (
      <button
        type='button'
        className={baseClass(isActive, props.className)}
        onClick={e => {
          props.onClick?.(e)
          onToggleChildren()
        }}
      >
        <Icon className={cn('size-5 transition-all', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
        <span
          className={cn(
            'text-[10px] leading-tight font-medium text-nowrap',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {label}
        </span>
        <ChevronDown
          className={cn('absolute right-2 bottom-2 size-3 transition-transform', isExpanded && 'rotate-180')}
        />
      </button>
    )
  }

  const { href, label, icon: Icon, isActive } = props

  return (
    <Link href={href} onClick={props.onClick} className={baseClass(isActive, props.className)}>
      <Icon className={cn('size-5 transition-all', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
      <span
        className={cn(
          'text-[10px] leading-tight font-medium text-nowrap',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {label}
      </span>
    </Link>
  )
}

export const MotionBottomNavigationItem = motion(BottomNavigationItem, {
  forwardMotionProps: true
})
