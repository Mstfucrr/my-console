'use client'

import { ConfirmButton } from '@/components/ui/confirm-button'
import { useAuth } from '@/context/AuthContext'
import { useIsSmallerThanTablet } from '@/hooks/use-media-query'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const { logout } = useAuth()

  const isSmallerThanTablet = useIsSmallerThanTablet()

  return (
    <ConfirmButton
      type='button'
      size={isSmallerThanTablet ? 'icon-sm' : 'icon-sm'}
      onConfirm={logout}
      color='destructive'
      variant='outline'
      confirmationMessage='Çıkış yapmak istediğinize emin misiniz?'
      confirmButtonMessage='Çıkış Yap'
      cancelButtonMessage='İptal'
      confirmButtonColor='destructive'
    >
      <LogOut className='size-4' />
      <span className='sr-only ml-2'>Çıkış Yap</span>
    </ConfirmButton>
  )
}
