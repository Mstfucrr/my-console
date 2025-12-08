'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import { Bell, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { useNotifications } from '../hooks/use-notifications'
import { NotificationList } from './NotificationList'

export function MobileMenuPopover() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const { unreadCount, markAllAsRead } = useNotifications()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='relative size-10'>
          <Menu className='size-6' />
          {unreadCount > 0 && (
            <Badge className='absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full p-0 text-xs'>
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-0' align='start' sideOffset={8}>
        <div className='p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='font-semibold'>Menü</h3>
          </div>

          <Separator className='mb-3' />

          {/* Bildirimler */}
          <div className='mb-3'>
            <div className='mb-2 flex items-center gap-2 px-1'>
              <Bell className='text-muted-foreground size-4' />
              <span className='text-sm font-medium'>Bildirimler</span>
              {unreadCount > 0 && (
                <Badge className='flex size-5 items-center justify-center rounded-full text-[10px]'>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
              {unreadCount > 0 && (
                <Button variant='ghost' size='xs' onClick={markAllAsRead} className='ml-auto text-xs'>
                  Tümünü okundu işaretle
                </Button>
              )}
            </div>
            <NotificationList maxHeight='max-h-48' compact />
          </div>

          <Separator className='mb-3' />

          {/* Çıkış */}
          <ConfirmButton
            type='button'
            variant='ghost'
            className='text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start gap-2 px-1.5'
            onConfirm={logout}
            confirmationMessage='Çıkış yapmak istediğinize emin misiniz?'
            confirmButtonMessage='Çıkış Yap'
            cancelButtonMessage='İptal'
            confirmButtonColor='destructive'
          >
            <LogOut className='size-4' />
            <span>Çıkış Yap</span>
          </ConfirmButton>
        </div>
      </PopoverContent>
    </Popover>
  )
}
