import { Home, Settings, ShoppingCart, Store } from 'lucide-react'
import { MenuItem } from './type'

type SidebarNavType = {
  sidebarNav: MenuItem[]
}

export const menusConfig: SidebarNavType = {
  sidebarNav: [
    {
      title: 'Dashboard',
      Icon: Home,
      href: '/'
    },
    {
      title: 'Siparişler',
      Icon: ShoppingCart,
      href: '/orders'
    },
    {
      title: 'Restoranlarım',
      Icon: Store,
      href: '/restaurants'
    },
    {
      title: 'Ayarlar',
      Icon: Settings,
      href: '/settings'
    }
  ]
}
