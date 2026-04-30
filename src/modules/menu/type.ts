import { LucideIcon } from 'lucide-react'
import { Route } from 'next'

type SingleMenuItem = {
  title: string
  href: Route
  Icon: LucideIcon
}

type MultiMenuItem = {
  title: string
  Icon: LucideIcon
  children: Array<{
    title: string
    href: Route
  }>
}

type MenuItem = SingleMenuItem | MultiMenuItem

export type { MenuItem, MultiMenuItem, SingleMenuItem }
