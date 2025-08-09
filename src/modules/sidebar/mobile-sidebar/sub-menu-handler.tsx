'use client'
import { type MenuItem } from '@/modules/sidebar/type'
import MenuItemButton from '../common/menu-item-button'

type SubMenuHandlerProps = {
  item: MenuItem
  toggleSubmenu: (index: number) => void
  index: number
  activeSubmenu: number | null
}

const SubMenuHandler = ({ item, toggleSubmenu, index, activeSubmenu }: SubMenuHandlerProps) => {
  return (
    <MenuItemButton
      menuItem={item}
      isActiveSubMenu={activeSubmenu === index}
      onClick={() => toggleSubmenu(index)}
      showChevron={true}
    />
  )
}

export default SubMenuHandler
