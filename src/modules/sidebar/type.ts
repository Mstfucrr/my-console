import { LucideIcon } from 'lucide-react'

type MenuItem = {
  title: string
  href?: string
  isHeader?: boolean
  child?: MenuItem[]
  multi_menu?: MenuItem[]
  badge?: string
  Icon?: LucideIcon
  isLocked?: boolean
  demand?: string[] | string
  target?: string
}

export type { MenuItem }
