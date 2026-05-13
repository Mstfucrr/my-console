import { LucideIcon } from 'lucide-react'
import { Route } from 'next'

type LinkMenuItem = {
  type: 'link'
  title: string
  href: Route
  Icon: LucideIcon
  alwaysShow?: boolean
}

type AppMenuItem = {
  type: 'app'
  title: string
  appTitle: string
  href: Route
  activePathPrefix: string
  Icon: LucideIcon
  appMenuItems: LinkMenuItem[]
}

type MenuItem = LinkMenuItem | AppMenuItem

export type { AppMenuItem, LinkMenuItem, MenuItem }
