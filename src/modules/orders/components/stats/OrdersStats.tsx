'use client'

import StatCard from '@/components/StatCard'
import { ORDER_STATUS_TEXT_COLORS } from '@/constants'
import { OrderStatusIcons, StatCardIcons } from '@/constants/icons'
import { OrderStatusLabel } from '@/modules/types'
import { LucideIcon } from 'lucide-react'
import { useMemo } from 'react'
import { OrdersContextType, useOrders } from '../../context/OrdersContext'

interface Stat {
  title: string
  id: keyof OrdersContextType['stats']
  Icon: LucideIcon
  color: string
  value: number
}

const statsList: Array<Stat> = [
  {
    title: 'Toplam',
    id: 'total',
    Icon: StatCardIcons.TotalOrders,
    color: 'text-blue-600',
    value: 0
  },
  {
    title: OrderStatusLabel.created,
    id: 'created',
    Icon: OrderStatusIcons.created,
    color: ORDER_STATUS_TEXT_COLORS['created'],
    value: 0
  },
  {
    title: OrderStatusLabel.shipped,
    id: 'shipped',
    Icon: OrderStatusIcons.shipped,
    color: ORDER_STATUS_TEXT_COLORS['shipped'],
    value: 0
  },
  {
    title: OrderStatusLabel.delivered,
    id: 'delivered',
    Icon: OrderStatusIcons.delivered,
    color: ORDER_STATUS_TEXT_COLORS['delivered'],
    value: 0
  },
  {
    title: OrderStatusLabel.cancelled,
    id: 'cancelled',
    Icon: OrderStatusIcons.cancelled,
    color: ORDER_STATUS_TEXT_COLORS['cancelled'],
    value: 0
  }
]

export function OrdersStats() {
  const { stats: statsData, isStatsLoading } = useOrders()

  const stats = useMemo(() => statsList.map(stat => ({ ...stat, value: statsData[stat.id] || 0 })), [statsData])

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
      {stats.map(stat => (
        <StatCard {...stat} key={stat.id} className='size-full' isLoading={isStatsLoading} />
      ))}
    </div>
  )
}
