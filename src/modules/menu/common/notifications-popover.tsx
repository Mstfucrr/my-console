'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useNotifications } from '../hooks/use-notifications'
import { NotificationList } from './NotificationList'

interface NotificationsPopoverProps {
  triggerClassName?: string
}

export function NotificationsPopover({ triggerClassName }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false)
  const { unreadCount, markAllAsRead } = useNotifications()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className={cn('relative size-9', triggerClassName)}>
          <Bell className='size-6' />
          {unreadCount > 0 && (
            <Badge className='absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full p-0 text-xs'>
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-0' align='end' sideOffset={8}>
        <div className='flex items-center justify-between border-b p-4 pb-2'>
          <h3 className='font-semibold'>Bildirimler</h3>
          {unreadCount > 0 && (
            <Button variant='ghost' size='xs' onClick={markAllAsRead} className='text-xs'>
              Tümünü okundu işaretle
            </Button>
          )}
        </div>
        <NotificationList />
      </PopoverContent>
    </Popover>
  )
}
