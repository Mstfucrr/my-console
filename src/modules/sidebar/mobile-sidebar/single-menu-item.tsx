import { type MenuItem } from '@/modules/sidebar/type'
import { isLocationMatch } from '@/modules/sidebar/utils'
import { usePathname } from 'next/navigation'
import MenuItemButton from '../common/menu-item-button'

type SingleMenuItemProps = {
  item: MenuItem
}

export default function SingleMenuItem({ item }: SingleMenuItemProps) {
  const pathname = usePathname()

  const isActive = isLocationMatch(item.href, pathname)

  return <MenuItemButton menuItem={item} isActive={isActive} />
}
