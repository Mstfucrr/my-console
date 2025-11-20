'use client'

import StatCard from '@/components/StatCard'
import { OrderStatusIcons, StatCardIcons } from '@/constants/icons'
import { ORDER_STATUS_TEXT_COLORS, OrderStatusGroup } from '@/constants/orders'
import { OrderStatusesGroups } from '@/types'
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
    title: OrderStatusGroup[OrderStatusesGroups.CREATED].label,
    id: 'created',
    Icon: OrderStatusIcons[OrderStatusesGroups.CREATED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.CREATED],
    value: 0
  },
  {
    title: OrderStatusGroup[OrderStatusesGroups.SHIPPED].label,
    id: 'shipped',
    Icon: OrderStatusIcons[OrderStatusesGroups.SHIPPED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.SHIPPED],
    value: 0
  },
  {
    title: OrderStatusGroup[OrderStatusesGroups.DELIVERED].label,
    id: 'delivered',
    Icon: OrderStatusIcons[OrderStatusesGroups.DELIVERED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.DELIVERED],
    value: 0
  },
  {
    title: OrderStatusGroup[OrderStatusesGroups.CANCELLED].label,
    id: 'cancelled',
    Icon: OrderStatusIcons[OrderStatusesGroups.CANCELLED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.CANCELLED],
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
