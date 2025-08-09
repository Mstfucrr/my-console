import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useIsDesktop } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/sidebar'
import { motion } from 'framer-motion'
import { ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItem } from '../type'
import { isLocationMatch } from '../utils'

type MenuItemButtonProps = {
  menuItem: MenuItem
  isActiveSubMenu?: boolean
  isActive?: boolean
  onClick?: () => void
  showChevron?: boolean
}

function MenuItemButtonContent({ menuItem, isActiveSubMenu, isActive, showChevron, onClick }: MenuItemButtonProps) {
  const { expanded, hovered } = useSidebar()
  const { title, Icon, badge, target, child } = menuItem
  const pathname = usePathname()

  const isDesktop = useIsDesktop()

  // Check if any child menu item is active
  const isChildActive = child?.some(item => {
    if (item.href) {
      return isLocationMatch(item.href, pathname)
    }
    // Check multi_menu items if they exist
    return item.multi_menu?.some(multiItem => isLocationMatch(multiItem.href ?? '', pathname))
  })

  if (!expanded && !hovered && isDesktop)
    return (
      <motion.div
        className={cn('mx-auto h-12 w-full pt-3 pl-2', isActive || isChildActive ? 'text-primary' : 'text-default-600')}
      >
        {Icon && <Icon className='size-6' />}
      </motion.div>
    )

  return (
    <Button
      variant='ghost'
      className={cn(
        'text-default-700 hover:bg-primary hover:text-primary-foreground flex h-12 w-full items-center justify-normal gap-3 rounded-xl px-[10px] py-3 text-sm font-medium capitalize',
        {
          'text-primary': isActive || isChildActive,
          'border-primary border-t-2 border-l-2': isActiveSubMenu || isChildActive
        }
      )}
      onClick={onClick}
    >
      {Icon && <Icon className='size-6' />}
      <h3 className='text-base font-semibold whitespace-nowrap'>{title}</h3>
      {badge && <Badge className='rounded'>{badge}</Badge>}
      {target === '_blank' && <ExternalLink className='ml-auto h-4 w-4' />}
      {showChevron && (
        <ChevronRight
          className={cn('ml-auto h-5 w-5 transition-transform', { 'rotate-90': isActiveSubMenu || isChildActive })}
        />
      )}
    </Button>
  )
}

export default function MenuItemButton({ menuItem, onClick, ...props }: MenuItemButtonProps) {
  if (onClick) return <MenuItemButtonContent menuItem={menuItem} onClick={onClick} {...props} />

  return (
    <Link href={menuItem.href ?? ''} target={menuItem.target}>
      <MenuItemButtonContent menuItem={menuItem} {...props} />
    </Link>
  )
}
