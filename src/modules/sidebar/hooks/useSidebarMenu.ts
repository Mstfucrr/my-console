import { useSidebar } from '@/store/sidebar'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MenuItem } from '../type'
import { isLocationMatch } from '../utils'

export function useSidebarMenu(menus: MenuItem[]) {
  const [activeSubmenus, setActiveSubmenus] = useState<number[]>([])
  const [activeMultiMenu, setActiveMultiMenu] = useState<number | null>(null)
  const pathname = usePathname()
  const { setMobileMenu } = useSidebar()

  useEffect(() => {
    // Close mobile menu when pathname changes
    setMobileMenu(false)

    let subMenuIndex: number | null = null
    let multiMenuIndex: number | null = null

    menus.forEach((item, i) => {
      if (item.child) {
        item.child.forEach((childItem, j) => {
          if (isLocationMatch(childItem.href, pathname)) subMenuIndex = i
          if (childItem.multi_menu) {
            childItem.multi_menu.forEach(multiItem => {
              if (isLocationMatch(multiItem.href, pathname)) {
                subMenuIndex = i
                multiMenuIndex = j
              }
            })
          }
        })
      }
    })

    if (subMenuIndex !== null) {
      setActiveSubmenus(prev => [...prev, subMenuIndex].filter((index): index is number => index !== null))
    }

    setActiveMultiMenu(multiMenuIndex)
  }, [pathname])

  const toggleSubmenu = (i: number) => {
    setActiveSubmenus(prev => (prev.includes(i) ? prev.filter(sub => sub !== i) : [...prev, i]))
  }

  const toggleMultiMenu = (subIndex: number) => {
    setActiveMultiMenu(prev => (prev === subIndex ? null : subIndex))
  }

  return { activeSubmenus, activeMultiMenu, toggleSubmenu, toggleMultiMenu }
}
