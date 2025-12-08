'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell } from 'lucide-react'
import { useNotifications } from '../hooks/use-notifications'
import { NotificationItem } from './NotificationItem'

interface NotificationListProps {
  maxHeight?: string
  compact?: boolean
}

export function NotificationList({ maxHeight = 'max-h-80', compact = false }: NotificationListProps) {
  const { notifications, markAsRead } = useNotifications()

  if (notifications.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <Bell className='text-muted-foreground/50 mb-2 h-12 w-12' />
        <p className='text-muted-foreground text-sm'>Henüz bildirim yok</p>
      </div>
    )
  }

  return (
    <ScrollArea className={maxHeight}>
      <div className={compact ? 'space-y-1 pr-2' : 'p-2'}>
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
        ))}
      </div>
    </ScrollArea>
  )
}

