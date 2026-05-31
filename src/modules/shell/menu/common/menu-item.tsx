import { Button } from '@/components/ui/button'
import { usePermission } from '@/hooks/use-permission'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type MenuItem } from '../type'
import { isLocationMatch } from '../utils'

type MenuItemProps = {
  item: MenuItem
}

export function MenuItem({ item }: MenuItemProps) {
  const pathname = usePathname()
  const { checkRoute } = usePermission()

  if (!checkRoute(item.href)) return null

  const isActive =
    item.type === 'app' && pathname
      ? pathname === item.activePathPrefix || pathname.startsWith(`${item.activePathPrefix}/`)
      : isLocationMatch(item.href, pathname)

  const isApp = item.type === 'app'

  const layoutId = `menu-item-${item.href.toLowerCase()}`

  return (
    <motion.li
      className='w-full object-top'
      initial={{ opacity: 0, y: isApp ? 0 : -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isApp ? 0 : -40 }}
      layoutId={layoutId}
      transition={{ duration: 0.55 }}
    >
      <Link href={item.href} className='inline-flex w-full'>
        <Button
          tabIndex={-1}
          variant='ghost'
          size='xs'
          className={cn(
            'hover:bg-primary hover:text-primary-foreground flex w-full items-center gap-2 rounded-xl text-xs font-semibold',
            isApp && 'border-primary/15 bg-primary/5 text-primary border',
            { 'bg-primary text-primary-foreground': isActive }
          )}
        >
          <item.Icon className='size-4.5' />
          <span className='whitespace-nowrap'>{item.title}</span>
        </Button>
      </Link>
    </motion.li>
  )
}
