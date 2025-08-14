import { Home, Settings, ShoppingCart, Store } from 'lucide-react'
import { MenuItem } from './type'

export const menusConfig: MenuItem[] = [
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
    title: 'Mutabakat İşlemleri',
    Icon: Store,
    href: '/reconciliation'
  },
  {
    title: 'Ayarlar',
    Icon: Settings,
    href: '/settings'
  }
]
