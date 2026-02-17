'use client'

import { ButtonProps } from '@/components/ui/button'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'

export function LogoutButton({
  className,
  showLabel = false,
  iconClassName,
  ...props
}: ButtonProps & { iconClassName?: string; showLabel?: boolean }) {
  const { logout } = useAuth()

  const getButtonSize = () => {
    if (showLabel) return 'xs'
    return 'icon-sm'
  }

  return (
    <ConfirmButton
      type='button'
      onConfirm={logout}
      data-testid='logout-button'
      color='destructive'
      size={getButtonSize()}
      variant='outline'
      confirmationMessage='Çıkış yapmak istediğinize emin misiniz?'
      confirmButtonMessage='Çıkış Yap'
      cancelButtonMessage='İptal'
      confirmButtonColor='destructive'
      confirmButtonProps={{ 'data-testid': 'logout-confirm' } as ButtonProps}
      className={className}
      {...props}
    >
      <LogOut className={cn('size-4', iconClassName)} />
      <span className={cn('ml-2', !showLabel && 'sr-only')}>Çıkış Yap</span>
    </ConfirmButton>
  )
}
