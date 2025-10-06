'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Bell, CheckCircle, Info } from 'lucide-react'
import { useState } from 'react'

interface Notification {
  id: number
  title: string
  message: string
  time: string
  type: 'info' | 'success' | 'warning'
  read?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Yeni Sipariş Alındı',
    message: '#12345 numaralı sipariş alındı',
    time: '5 dakika önce',
    type: 'info'
  },
  {
    id: 2,
    title: 'Sipariş Teslim Edildi',
    message: '#12344 numaralı sipariş teslim edildi',
    time: '1 saat önce',
    type: 'success'
  },
  {
    id: 3,
    title: 'Ödeme Onaylandı',
    message: '#12343 numaralı sipariş ödemesi onaylandı',
    time: '2 saat önce',
    type: 'success'
  }
]

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className='h-4 w-4 text-green-500' />
      case 'warning':
        return <Info className='h-4 w-4 text-yellow-500' />
      default:
        return <Info className='h-4 w-4 text-blue-500' />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='relative size-9'>
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
        <ScrollArea className='max-h-80'>
          {notifications.length > 0 ? (
            <div className='p-2'>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    'hover:bg-muted flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors',
                    { 'bg-muted/30': !notification.read }
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className='mt-0.5 flex-shrink-0'>{getNotificationIcon(notification.type)}</div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-foreground text-sm font-medium'>{notification.title}</p>
                    <p className='text-muted-foreground mt-1 text-sm'>{notification.message}</p>
                    <p className='text-muted-foreground mt-2 text-xs'>{notification.time}</p>
                  </div>
                  {!notification.read && <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500' />}
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <Bell className='text-muted-foreground/50 mb-2 h-12 w-12' />
              <p className='text-muted-foreground text-sm'>Henüz bildirim yok</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
