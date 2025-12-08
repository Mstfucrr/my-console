'use client'

import StatCard from '@/components/StatCard'
import { OrderStatusIcons, StatCardIcons } from '@/constants/icons'
import { ORDER_STATUS_TEXT_COLORS, OrderStatusGroup } from '@/constants/orders'
import { cn } from '@/lib/utils'
import { OrderStatusesGroups } from '@/types'
import { LucideIcon } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'
import { ACTIVE_STATUS_GROUPS, COMPLETED_STATUS_GROUPS } from '../../constants'
import { useOrders } from '../../context/OrdersContext'
import { useOrdersStats } from '../../hooks/useOrdersStats'

interface Stat {
  title: string
  id: 'total' | OrderStatusesGroups
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
    id: OrderStatusesGroups.CREATED,
    Icon: OrderStatusIcons[OrderStatusesGroups.CREATED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.CREATED],
    value: 0
  },
  {
    title: OrderStatusGroup[OrderStatusesGroups.SHIPPED].label,
    id: OrderStatusesGroups.SHIPPED,
    Icon: OrderStatusIcons[OrderStatusesGroups.SHIPPED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.SHIPPED],
    value: 0
  },
  {
    title: OrderStatusGroup[OrderStatusesGroups.DELIVERED].label,
    id: OrderStatusesGroups.DELIVERED,
    Icon: OrderStatusIcons[OrderStatusesGroups.DELIVERED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.DELIVERED],
    value: 0
  },
  {
    title: OrderStatusGroup[OrderStatusesGroups.CANCELLED].label,
    id: OrderStatusesGroups.CANCELLED,
    Icon: OrderStatusIcons[OrderStatusesGroups.CANCELLED],
    color: ORDER_STATUS_TEXT_COLORS[OrderStatusesGroups.CANCELLED],
    value: 0
  }
]

export const OrdersStats = memo(function OrdersStats() {
  const { stats: statsData, isStatsLoading } = useOrdersStats()

  const { activeTab } = useOrders()

  const stats = useMemo(() => statsList.map(stat => ({ ...stat, value: statsData?.[stat.id] || 0 })), [statsData])

  const getStatClassName = useCallback(
    (statId: string) =>
      cn('size-full first:col-span-2 first:w-1/2 first:justify-self-center', {
        'opacity-50':
          statId !== 'total' &&
          ((activeTab === 'completed' && ACTIVE_STATUS_GROUPS.includes(statId as OrderStatusesGroups)) ||
            (activeTab === 'active' && COMPLETED_STATUS_GROUPS.includes(statId as OrderStatusesGroups))),
        'border-l-4 border-l-red-500': statId === OrderStatusesGroups.CREATED
      }),
    [activeTab]
  )

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
      {stats.map(stat => (
        <StatCard {...stat} key={stat.id} className={getStatClassName(stat.id)} isLoading={isStatsLoading} />
      ))}
    </div>
  )
})
