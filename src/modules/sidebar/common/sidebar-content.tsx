import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsDesktop } from '@/hooks/use-media-query'
import { useSidebar } from '@/store/sidebar'
import { AnimatePresence } from 'framer-motion'
import { useSidebarMenu } from '../hooks/useSidebarMenu'
import SingleMenuItem from '../mobile-sidebar/single-menu-item'
import SubMenuHandler from '../mobile-sidebar/sub-menu-handler'
import { MenuItem } from '../type'
import LogoutButton from './logout-button'
import MenuLabel from './menu-label'
import NestedSubMenu from './nested-menus'

type SidebarContentProps = {
  menus: MenuItem[]
}

const SidebarContent = ({ menus }: SidebarContentProps) => {
  const { expanded, hovered, mobileMenu } = useSidebar()

  const { activeSubmenus, activeMultiMenu, toggleSubmenu, toggleMultiMenu } = useSidebarMenu(menus)

  const isMobile = !useIsDesktop()

  return (
    <div className='flex h-full w-full flex-col pb-5'>
      <ScrollArea className='mt-2 max-h-[calc(100%-100px)] flex-1 px-4 pb-2'>
        <ul className='flex flex-col gap-2 pt-2'>
          {menus.map((item, i) => (
            <li key={`menu_key_${i}`}>
              {!item.child && !item.isHeader && <SingleMenuItem item={item} />}
              {item.isHeader && !item.child && (expanded || hovered) && <MenuLabel item={item} />}
              {item.child && (
                <>
                  <SubMenuHandler
                    item={item}
                    toggleSubmenu={toggleSubmenu}
                    index={i}
                    activeSubmenu={activeSubmenus.includes(i) ? i : null}
                  />
                  <AnimatePresence>
                    {activeSubmenus.includes(i) && (expanded || hovered || isMobile) && (
                      <NestedSubMenu
                        toggleMultiMenu={toggleMultiMenu}
                        activeMultiMenu={activeMultiMenu}
                        activeSubmenu={activeSubmenus.includes(i) ? i : null}
                        item={item}
                        index={i}
                      />
                    )}
                  </AnimatePresence>
                </>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div className='w-full self-end px-4'>
        <LogoutButton expanded={expanded} hovered={hovered} mobileMenu={mobileMenu} />
      </div>
    </div>
  )
}

export default SidebarContent
