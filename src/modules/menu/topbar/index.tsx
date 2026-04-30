'use client'

import { SiteLogoBig } from '@/components/svg'
import { useProfile } from '@/context/ProfileProvider'
import { getMenuConfig } from '@/lib/get-menu-config'
import { isTenantUser } from '@/lib/permissions'
import { CreateOrderButton } from '../common/create-order-button'
import { MenuItem } from '../common/menu-item'
import { NewApplicationButton } from '../common/new-application-button'
import { ProfileButton } from '../common/profile-button'
import { SupportDialog } from '../common/support-dialog'

export function Topbar() {
  const { profile } = useProfile()
  const menus = getMenuConfig(profile)
  const tenant = isTenantUser(profile)

  return (
    <>
      <div className='bg-primary-10 fixed top-0 z-50 w-full border-b shadow-md backdrop-blur-xl'>
        <div className='container mx-auto flex h-16 items-center gap-4 px-4'>
          <SiteLogoBig className='text-primary w-32' />

          <div className='flex h-full flex-1 items-center'>
            <nav className='flex h-full items-center'>
              <ul className='flex items-center gap-1'>
                {menus?.map(item => <MenuItem key={item.title} item={item} />)}
              </ul>
            </nav>
          </div>

          <div className='ml-auto flex items-center gap-2'>
            {!tenant ? <CreateOrderButton /> : <NewApplicationButton />}
            <ProfileButton />
          </div>
        </div>
      </div>
      <div className='fixed right-5 bottom-5 z-50'>
        <SupportDialog />
      </div>
    </>
  )
}
