import { useState } from 'react'

export interface Notification {
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

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}
