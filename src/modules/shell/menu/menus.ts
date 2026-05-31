import { ModuleIcons } from '@/constants/icons'
import { Building2, ClipboardList } from 'lucide-react'
import { MenuItem } from './type'

/** Restoran (hesap ID’li) kullanıcı menüsü */
export const menusConfig: MenuItem[] = [
  { type: 'link', title: 'Ana Sayfa', Icon: ModuleIcons.Home, href: '/dashboard', alwaysShow: true },
  { type: 'link', title: 'Siparişler', Icon: ModuleIcons.Orders, href: '/orders' },
  { type: 'link', title: 'Mutabakat', Icon: ModuleIcons.Reconciliation, href: '/reconciliation' },
  { type: 'link', title: 'Raporlar', Icon: ModuleIcons.Reports, href: '/reports' },
  {
    type: 'app',
    title: 'Tedarik',
    appTitle: 'Tedarik',
    Icon: ModuleIcons.B2BCommerce,
    href: '/b2b-commerce/orders/create',
    activePathPrefix: '/b2b-commerce',
    appMenuItems: [
      { type: 'link', title: 'Ürünler', Icon: ModuleIcons.OrdersCreate, href: '/b2b-commerce/orders/create' },
      { type: 'link', title: 'Siparişler', Icon: ModuleIcons.Orders, href: '/b2b-commerce/orders' }
    ]
  }
]

/** Tenant (hesap ID’siz şube) kullanıcı menüsü */
export const tenantMenusConfig: MenuItem[] = [
  { type: 'link', title: 'Başvurularım', Icon: ClipboardList, href: '/applications' },
  { type: 'link', title: 'Şubelerim', Icon: Building2, href: '/stores' }
]
