'use client'

import { cn } from '@/lib/utils'
import { CheckCircle, Info } from 'lucide-react'
import type { Notification } from '../hooks/use-notifications'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: number) => void
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

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  return (
    <div
      className={cn('hover:bg-muted flex cursor-pointer items-start gap-2 rounded-lg p-2 transition-colors', {
        'bg-muted/30': !notification.read
      })}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className='mt-0.5 shrink-0'>{getNotificationIcon(notification.type)}</div>
      <div className='min-w-0 flex-1'>
        <p className='text-foreground text-xs font-medium'>{notification.title}</p>
        <p className='text-muted-foreground mt-0.5 text-xs'>{notification.message}</p>
        <p className='text-muted-foreground mt-1 text-[10px]'>{notification.time}</p>
      </div>
      {!notification.read && <div className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500' />}
    </div>
  )
}
