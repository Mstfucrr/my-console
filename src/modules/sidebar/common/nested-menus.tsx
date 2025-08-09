'use client'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { MenuItem } from '../type'
import { isLocationMatch } from '../utils'
import MultiMenuHandler from './multi-menu-handler'
import MultiNestedMenu from './multi-nested-menu'
import SubMenuItem from './sub-menu-item'

type NestedSubMenuProps = {
  activeSubmenu: number | null
  item: MenuItem
  index: number
  activeMultiMenu: number | null
  toggleMultiMenu: (index: number) => void
}

const listVariants = {
  initial: { height: 0 },
  animate: {
    height: 'auto',
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  },
  exit: {
    height: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.01,
      staggerDirection: -1
    }
  }
}

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

const NestedSubMenu = ({ activeSubmenu, item, index, activeMultiMenu, toggleMultiMenu }: NestedSubMenuProps) => {
  const pathname = usePathname() ?? ''

  return (
    <Collapsible open={activeSubmenu === index}>
      <CollapsibleContent>
        <motion.ul
          className='before:bg-primary/10 relative space-y-4 before:absolute before:top-0 before:left-4 before:h-[calc(100%-5px)] before:w-[3px] before:rounded'
          variants={listVariants}
          initial='initial'
          animate='animate'
          exit='exit'
        >
          {item.child?.map((subItem: MenuItem, j: number) => (
            <motion.li
              variants={itemVariants}
              className={cn(
                'relative block pl-9 before:absolute before:top-0 before:left-4 before:w-[3px] first:pt-4 first:before:top-4 last:pb-2',
                {
                  'before:bg-primary before:h-full first:before:h-[calc(100%-16px)]': isLocationMatch(
                    subItem.href ?? '',
                    pathname
                  )
                }
              )}
              key={`sub_menu_${j}`}
            >
              {subItem?.multi_menu ? (
                <div>
                  <MultiMenuHandler
                    subItem={subItem}
                    subIndex={j}
                    activeMultiMenu={activeMultiMenu}
                    toggleMultiMenu={toggleMultiMenu}
                  />
                  <MultiNestedMenu subItem={subItem} subIndex={j} activeMultiMenu={activeMultiMenu} />
                </div>
              ) : (
                <SubMenuItem subItem={subItem} />
              )}
            </motion.li>
          ))}
        </motion.ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default NestedSubMenu
