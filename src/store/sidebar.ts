import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SidebarState {
  expanded: boolean
  setExpanded: (value: boolean) => void

  hovered: boolean
  setHovered: (value: boolean) => void

  subMenu: boolean
  setSubmenu: (value: boolean) => void

  mobileMenu: boolean
  setMobileMenu: (value: boolean) => void
}

export const useSidebar = create<SidebarState>()(
  persist(
    set => ({
      expanded: false,
      setExpanded: value => set({ expanded: value }),
      hovered: false,
      setHovered: value => set({ hovered: value }),
      subMenu: false,
      setSubmenu: value => set({ subMenu: value }),
      mobileMenu: false,
      setMobileMenu: value => set({ mobileMenu: value })
    }),
    { name: 'sidebar-store', storage: createJSONStorage(() => localStorage) }
  )
)
