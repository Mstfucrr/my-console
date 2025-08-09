'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/context/AuthContext'
import { LogOut, User as UserIcon } from 'lucide-react'
import Link from 'next/link'

type UserMenuProps = {
  name?: string
  restaurant?: string
}

const UserMenu = ({ name, restaurant }: UserMenuProps) => {
  const { logout } = useAuth()
  const displayName = name || 'Kullanıcı Adı'
  const displayRestaurant = restaurant || 'Restoran Adı'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' className='flex h-12 items-center gap-3 px-2'>
          <div className='bg-primary text-primary-foreground grid size-9 place-items-center rounded-full'>
            <UserIcon className='size-5' />
          </div>
          <div className='hidden min-w-0 flex-col text-left leading-tight sm:flex'>
            <span className='truncate text-sm font-semibold'>{displayName}</span>
            <span className='truncate text-xs'>{displayRestaurant}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' sideOffset={8} className='w-40 p-0'>
        <div className='border-t'>
          <Link href='/profile' className='hover:bg-muted flex items-center gap-2 px-4 py-2 text-sm'>
            <UserIcon className='size-4' />
            Profil
          </Link>
          <button
            type='button'
            onClick={logout}
            className='text-destructive hover:bg-muted flex w-full items-center gap-2 px-4 py-2 text-left text-sm'
          >
            <LogOut className='size-4' />
            Çıkış Yap
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default UserMenu
