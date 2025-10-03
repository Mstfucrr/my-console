import { Home, ShoppingCart, Store } from 'lucide-react'
import { MenuItem } from './type'

export const menusConfig: MenuItem[] = [
  {
    title: 'Ana Sayfa',
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
  }
]
