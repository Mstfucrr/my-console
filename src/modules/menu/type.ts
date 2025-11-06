import { LucideIcon } from 'lucide-react'
import { Route } from 'next'

type MenuItem = {
  title: string
  href: Route
  Icon: LucideIcon
}

export type { MenuItem }
