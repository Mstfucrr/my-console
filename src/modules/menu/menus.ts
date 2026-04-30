import { ModuleIcons } from '@/constants/icons'
import { Building2, ClipboardList } from 'lucide-react'
import { MenuItem } from './type'

/** Restoran (hesap ID’li) kullanıcı menüsü */
export const menusConfig: MenuItem[] = [
  { title: 'Ana Sayfa', Icon: ModuleIcons.Home, href: '/' },
  { title: 'Siparişler', Icon: ModuleIcons.Orders, href: '/orders' },
  { title: 'Mutabakat', Icon: ModuleIcons.Reconciliation, href: '/reconciliation' },
  { title: 'Raporlar', Icon: ModuleIcons.Reports, href: '/reports' },
  {
    title: 'Tedarik',
    Icon: ModuleIcons.Supply,
    children: [
      { title: 'Sipariş Ver', href: '/supply-orders/create' },
      { title: 'Siparişlerim', href: '/supply-orders/my-orders' }
    ]
  }
]

/** Tenant (hesap ID’siz şube) kullanıcı menüsü */
export const tenantMenusConfig: MenuItem[] = [
  { title: 'Başvurularım', Icon: ClipboardList, href: '/applications' },
  { title: 'Şubelerim', Icon: Building2, href: '/stores' }
]
