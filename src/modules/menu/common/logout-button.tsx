'use client'

import { ButtonProps } from '@/components/ui/button'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { useAuth } from '@/context/AuthContext'
import { useIsSmallerThanTablet } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'

export function LogoutButton({ className, iconClassName, ...props }: ButtonProps & { iconClassName?: string }) {
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
      className={className}
      {...props}
    >
      <LogOut className={cn('size-4', iconClassName)} />
      <span className='sr-only ml-2'>Çıkış Yap</span>
    </ConfirmButton>
  )
}
