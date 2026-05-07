'use client'

import { Button, ButtonProps } from '@/components/ui/button'
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
    <Button
      type='button'
      onClick={logout}
      data-testid='logout-button'
      color='destructive'
      size={getButtonSize()}
      variant='outline'
      className={className}
      {...props}
    >
      <LogOut className={cn('size-4', iconClassName)} />
      <span className={cn('ml-2', !showLabel && 'sr-only')}>Çıkış Yap</span>
    </Button>
  )
}
