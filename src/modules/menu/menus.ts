import { BadgeTurkishLira, Home, ShoppingCart } from 'lucide-react'
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
    title: 'Mutabakat',
    Icon: BadgeTurkishLira,
    href: '/reconciliation'
  }
]
