import { ModuleIcons } from '@/constants/icons'
import { MenuItem } from './type'

export const menusConfig: MenuItem[] = [
  {
    title: 'Ana Sayfa',
    Icon: ModuleIcons.Home,
    href: '/'
  },
  {
    title: 'Siparişler',
    Icon: ModuleIcons.Orders,
    href: '/orders'
  },
  {
    title: 'Mutabakat',
    Icon: ModuleIcons.Reconciliation,
    href: '/reconciliation'
  },
  {
    title: 'Raporlar',
    Icon: ModuleIcons.Reports,
    href: '/reports'
  }
]
